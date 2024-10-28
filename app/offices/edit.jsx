// screens/accounts/AccountEdit.js
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import FormWrapper from "@/components/FormWrapper";
import { useNavigation } from "expo-router";
import { useRouteInfo, useRouter } from "expo-router/build/hooks";
import HeaderButton from "@/components/HeaderButton";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import SelectDialog from "@/components/inputs/SelectDialog";
import { createSyncManager } from "@/coopsys/db/syncManager";
import { useAuth } from "@/coopsys/auth/AuthProvider";
import { RegionModel, DistrictModel, OfficeModel } from "../../coopsys/models";
import settingModel from "../../coopsys/models/settingModel";

const regionModel = new RegionModel();
const districtModel = new DistrictModel();
const officeModel = new OfficeModel();

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
  const { user } = useAuth();
  const { setCallback2 } = useActivityResult();
  const syncManager = useRef(null);
  const { data: result } = route.params ?? {};
  const data = result ? JSON.parse(result) : {};
  const [formValues, setFormValues] = useState({ name: data?.name });
  const [region, setRegion] = useState(data?.region);
  const [district, setDistrict] = useState(data?.district);
  const [loading, setLoading] = useState(data?.id);
  const [submitting, setSubmitting] = useState(false);

  const [editDone, setEditDone] = useState(false);

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const organization = JSON.parse(
        await settingModel.getSetting("organization")
      );
      const lastid = (await officeModel.lastId()) + 1;
      const data = {
        id: lastid,
        ...formValues,
        district_id: district?.server_id,
        region_id: region?.server_id,
        owner: user.owner,
        creator: user.id,
        orgid: organization.orgid,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      await officeModel.saveRecord(data);
      handleSuccess(await officeModel.getOneByColumns({ id: lastid }));
    } catch (e) {
      console.log("handleSave", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccess = (data) => {
    router.dismiss();
    router.push({ pathname: "offices/details", params: data });
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
          disabled={!editDone || submitting}
          onPress={handleSave}
        />
      ),
    });
  }, [navigation, editDone, submitting]);

  useEffect(() => {
    createSyncManager(baseUrl, {
      regions: regionModel,
      districts: districtModel,
      offices: officeModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        manager.sync().catch((err) => {
          console.log("sync error", err);
        });
        if (data?.id) {
          setRegion(
            await regionModel.getOneByColumns({ server_id: data.region_id })
          );
          setDistrict(
            await districtModel.getOneByColumns({ server_id: data.district_id })
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
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
          value={`${district?.name} ${district?.category}`}
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
