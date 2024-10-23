// screens/accounts/AccountEdit.js
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView, View, Alert } from "react-native";
import FormWrapper from "@/components/FormWrapper";
import { useNavigation } from "expo-router";
import axios from "axios";

import { useRouteInfo, useRouter } from "expo-router/build/hooks";
import HeaderButton from "@/components/HeaderButton";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import SelectDialog from "@/components/inputs/SelectDialog";

import { createSyncManager } from "@/coopsys/db/syncManager";
import { RegionModel } from "@/coopsys/models/regionModel";
import { DistrictModel } from "@/coopsys/models/districtModel";

const regionModel = new RegionModel();
const districtModel = new DistrictModel();

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;

// Field configuration for the account form
const fieldConfig = [
  {
    name: "name",
    type: "text",
    label: "Office Name",
    placeholder: "Enter the name",
    required: true,
  },
];

export default function Edit() {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const { setCallback2 } = useActivityResult();

  const { data } = route.params?.data ? JSON.parse(route.params?.data) : {};
  const [formValues, setFormValues] = useState({ name: data?.name });
  const [region, setRegion] = useState(data?.region);
  const [district, setDistrict] = useState(data?.district);
  const [loading, setLoading] = useState(data?.id);

  const [editDone, setEditDone] = useState(false);

  const handleSave = () => {
    if (data?.id) {
      console.log(`${baseUrl}offices`);
      axios
        .put(`${baseUrl}offices/${data.id}`, {
          ...data,
          region_id: region.id,
          district_id: district.id,
          name: formValues.name,
        })
        .then(handleSuccess, handleFailed)
        .catch(handleError);
    } else {
      axios
        .post(
          `${baseUrl}offices`,
          {
            orgid: "ER_001",
            region_id: region.id,
            district_id: district.id,
            name: formValues.name,
          },
          { responseType: "json" }
        )
        .then(handleSuccess, handleFailed)
        .catch(handleError);
    }
  };

  const handleSuccess = ({ data }) => {
    if (data?.status) Alert.alert(data.message);
    else Alert.alert(data.message);
  };

  const handleFailed = ({ response }) => {
    const { data } = response;
    Alert.alert(data.message);
  };

  const handleError = (reason) => {
    console.log("axios.action", reason);
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: route.params?.data ? "Edit Office" : "New Office",
      headerLeft: () => (
        <HeaderButton bolded={false} title={"Cancel"} onPress={handleCancel} />
      ),
      headerRight: () => (
        <HeaderButton
          title={"Save"}
          disabled={!editDone}
          onPress={handleSave}
        />
      ),
    });
  }, [navigation, editDone]);

  useEffect(() => {
    if (data) {
      createSyncManager(baseUrl, {
        regions: regionModel,
        districts: districtModel,
      })
        .then(async (manager) => {
          manager.sync().catch((err) => {
            console.log("sync error", err);
          });

          setRegion(await regionModel.getOneByColumns({ id: data.id }));
          setDistrict(await districtModel.getOneByColumns({ id: data.id }));
          setLoading(false);
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  }, []);

  const handleRegionMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/regions",
      { selected: region ? [region.id] : [] }
    );
    if (data && data.length > 0) {
      setRegion(data[0]);
    }
  };

  const handleDistrictMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/districts",
      { selected: district ? [district.id] : [], regionId: region?.id }
    );
    if (data && data.length > 0) {
      setDistrict(data[0]);
    }
  };

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  useEffect(() => {
    setEditDone(region && district && formValues?.name);
  }, [region, district, formValues]);

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <FormWrapper
        fieldConfig={fieldConfig}
        formValues={formValues}
        handleChange={handleChange}
        containerStyle={{ marginTop: 16, paddingBottom: 30 }}
      />
      <View style={{ marginHorizontal: 16 }}>
        <SelectDialog
          loading={loading}
          label={"Select Region"}
          placeholder={"Select a region"}
          value={region?.name}
          onPress={handleRegionMenu}
        />
        <SelectDialog
          loading={loading}
          label={"Select District"}
          placeholder={"Select a district"}
          value={district?.name}
          onPress={handleDistrictMenu}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
