import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";

import HeaderButton from "@/components/HeaderButton";
import { useRouteInfo } from "expo-router/build/hooks";
import { Text } from "@rneui/themed";
import { Label } from "@/components/Label";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import { createSyncManager } from "@/coopsys/db/syncManager";
import { RegionModel, DistrictModel } from "@/coopsys/models";

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;
const regionModel = new RegionModel();
const districtModel = new DistrictModel();

const DetailsLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const syncManager = useRef(null);
  const { setCallback } = useActivityResult();
  const [data, setData] = useState(route.params);
  const [region, setRegion] = useState(null);
  const [district, setDistrict] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: data.name,
      headerRight: () => <HeaderButton title={"Edit"} onPress={handleEdit} />,
      headerTransparent: true,
    });
  }, [navigation, route]);

  const handleEdit = async () => {
    const result = await navigateForResult(
      setCallback,
      router,
      "offices/edit",
      data
    );
    setData(result);
  };

  useEffect(() => {
    createSyncManager(baseUrl, {
      regions: regionModel,
      district: districtModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        setRegion(
          await regionModel.getOneByColumns({ server_id: data.region_id })
        );
        setDistrict(
          await districtModel.getOneByColumns({ server_id: data.district_id })
        );
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  if (!data) return;

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.subContainer}>
          <Text style={styles.title}>{data.name}</Text>
          <Text style={styles.subtitle}>{data.off_code}</Text>
          <Text style={styles.date}>Added on: {data.created_at}</Text>
        </View>
      </View>

      <View style={styles.middleContainer}>
        <Label
          data={[
            {
              title: "Region",
              value: region?.name,
              icon: { name: "location", type: "ionicon" },
            },
            {
              title: "District",
              value: `${district?.name || ""} ${district?.category || ""}`,
              icon: { name: "location", type: "ionicon" },
            },
          ]}
          heading="Location"
        />
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
    gap: 2,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
});
