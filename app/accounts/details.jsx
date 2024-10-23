import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { ACCOUNT_DATA } from "@/constants/Resources";

import HeaderButton from "@/components/HeaderButton";
import { useRouteInfo } from "expo-router/build/hooks";
import { Text } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";
import CustomAvatar from "@/components/CustomAvatar";

const DetailsLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const [data, setData] = useState(
    ACCOUNT_DATA.find((item) => item.id === route.params.id)
  );

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerBackTitle: "List",
      headerRight: () => (
        <HeaderButton
          title={"Edit"}
          onPress={() => navigation.navigate("accounts/edit")}
        />
      ),
      headerTransparent: true,
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <CustomAvatar
          rounded
          size={150}
          source={{ uri: data.photo }}
          title={
            data.photo
              ? null
              : data.given_name.substring(0, 1) +
                data.family_name.substring(0, 1)
          }
        />
        <View style={styles.subContainer}>
          <Text style={styles.title}>
            {data.given_name} {data.family_name}
          </Text>
          <Text style={styles.subtitle}>A.K.A {data.name}</Text>
          <Text style={styles.date}>Joined: {data.date_joined}</Text>
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
