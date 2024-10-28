import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";

import HeaderButton from "@/components/HeaderButton";
import { useRouteInfo } from "expo-router/build/hooks";
import { Tab, TabView, Text, useTheme } from "@rneui/themed";
import { Label } from "@/components/Label";
import Passbooks from "@/components/search/Passbooks";
import Accounts from "@/components/search/Accounts";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import { createSyncManager } from "@/coopsys/db/syncManager";
import { OfficeModel, CommunityModel } from "@/coopsys/models";

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;
const officeModel = new OfficeModel();
const communityModel = new CommunityModel();

const DetailsLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const { theme } = useTheme();

  const { setCallback } = useActivityResult();
  const syncManager = useRef(null);
  const [data, setData] = useState(route.params);
  const [office, setOffice] = useState(null);
  const [community, setCommunity] = useState(null);
  const [index, setIndex] = React.useState(0);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      title: data.name,
      headerRight: () => <HeaderButton title={"Edit"} onPress={handleEdit} />,
    });
  }, [navigation, route]);

  const handleEdit = async () => {
    const result = await navigateForResult(
      setCallback,
      router,
      "associations/edit",
      data
    );
    setData(result);
  };

  useEffect(() => {
    createSyncManager(baseUrl, {
      offices: officeModel,
      communities: communityModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        setOffice(
          await officeModel.getOneByColumns({ server_id: data.office_id })
        );
        setCommunity(
          await communityModel.getOneByColumns({ server_id: data.community_id })
        );
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  // Interpolate padding based on scroll position
  const tabPadding = scrollY.interpolate({
    inputRange: [0, 335], // adjust 50 to control the scroll range for the effect
    outputRange: [16, 0], // 16 when away from top, 0 when close to top
    extrapolate: "clamp",
  });

  if (!data) return null;

  return (
    <Animated.ScrollView
      scrollEventThrottle={16}
      style={styles.container}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
      )}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topContainer}>
        <View style={styles.subContainer}>
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.subtitle}>{data.assoc_code}</Text>
          <Text style={styles.date}>Added on: {data.created_at}</Text>
        </View>
      </View>

      <View style={styles.middleContainer}>
        <Label
          data={[
            {
              title: "Office",
              value: office?.name,
              icon: { name: "business", type: "ionicon" },
            },
            {
              title: "Community",
              value: community?.name,
              icon: { name: "location", type: "ionicon" },
            },
          ]}
          heading="Location"
        />
      </View>

      <Animated.View
        style={[styles.tabContainer, { paddingHorizontal: tabPadding }]}
      >
        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          indicatorStyle={{
            height: 2,
            backgroundColor: theme.colors.primary,
          }}
          titleStyle={{ color: "#444", fontSize: 12 }}
          variant="default"
          buttonStyle={{ backgroundColor: "#fff" }}
          style={{ borderRadius: 8, overflow: "hidden" }}
        >
          <Tab.Item
            title="Passbooks"
            icon={{
              name: "address-book",
              type: "font-awesome",
              color: theme.colors.primary,
            }}
          />
          <Tab.Item
            title="Collections"
            icon={{
              name: "dollar",
              type: "font-awesome",
              color: theme.colors.primary,
            }}
          />
          <Tab.Item
            title="Members"
            icon={{
              name: "people",
              type: "ionic",
              size: 24,
              color: theme.colors.primary,
            }}
          />
        </Tab>
      </Animated.View>
      <Animated.View style={{ paddingHorizontal: tabPadding }}>
        <TabView
          containerStyle={{
            height: Dimensions.get("window").height - 160,
            overflow: "hidden",
          }}
          value={index}
          onChange={setIndex}
          animationType="spring"
        >
          <TabView.Item style={styles.tabItem}>
            <Passbooks association={data.server_id} />
          </TabView.Item>
          <TabView.Item style={styles.tabItem}>
            <Text h1>Favorite</Text>
          </TabView.Item>
          <TabView.Item style={styles.tabItem}>
            <Accounts association={data.server_id} />
          </TabView.Item>
        </TabView>
      </Animated.View>
    </Animated.ScrollView>
  );
};

export default DetailsLayout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f7f7f7",
    height: "100%",
  },
  tabContainer: {
    paddingHorizontal: 16,
  },
  tabItem: {
    width: "100%",
    marginEnd: 16,
  },
  topContainer: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    marginTop: 16,
  },
  subContainer: {
    alignItems: "center",
    margin: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: "300",
    color: "#0000007f",
  },
  line: {
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingBottom: 4,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "bold",
    color: "#444",
  },
  date: {
    fontSize: 14,
    fontWeight: "200",
  },
  middleContainer: {
    gap: 2,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
});
