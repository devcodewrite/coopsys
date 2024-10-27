import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";

import HeaderButton from "@/components/HeaderButton";
import { useRouteInfo } from "expo-router/build/hooks";
import { Text } from "@rneui/themed";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";

const DetailsLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();

  const { setCallback } = useActivityResult();
  const [data, setData] = useState(route.params);

  useEffect(() => {
    navigation.setOptions({
      title: data.pbnum,
      headerRight: () => <HeaderButton title={"Edit"} onPress={handleEdit} />,
      headerTransparent: true,
    });
  }, [navigation, route]);

  const handleEdit = async () => {
    const result = await navigateForResult(
      setCallback,
      router,
      "offices/edit",
      { data: data }
    );
    setData(result);
  };

  if (!data) return;

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.subContainer}>
          <Text style={styles.title}>{data?.name}</Text>
          <Text style={styles.subtitle}>{data.pbnum}</Text>
          <Text style={styles.date}>Added on: {data.created_at}</Text>
        </View>
      </View>

      <View style={styles.middleContainer}>
        <View style={styles.subContainer}></View>
      </View>
    </View>
  );
};

export default DetailsLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 100,
  },
  topContainer: {
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
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
  date: {
    fontSize: 14,
    fontWeight: "200",
  },

  middleContainer: {
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
  },
});
