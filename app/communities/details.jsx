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
import { OfficeModel, RegionModel, DistrictModel } from "@/coopsys/models";

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;
const officeModel = new OfficeModel();
const regionModel = new RegionModel();
const districtModel = new DistrictModel();

const DetailsLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const syncManager = useRef(null);
  const { setCallback } = useActivityResult();
  const [data, setData] = useState(route.params);
  const [office, setOffice] = useState(null);
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
      "communities/edit",
      data
    );
    setData(result);
  };

  useEffect(() => {
    createSyncManager(baseUrl, {
      offices: officeModel,
      regions: regionModel,
      district: districtModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        setOffice(
          await officeModel.getOneByColumns({ server_id: data.office_id })
        );
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
          <Text style={styles.subtitle}>{data.com_code}</Text>
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
              title: "Region",
              value: region?.name,
              icon: { name: "location", type: "ionicon" },
            },
            {
              title: "District",
              value: `${district?.name} ${district?.category}`,
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
  subtitle2: {
    fontSize: 14,
    fontWeight: "300",
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
