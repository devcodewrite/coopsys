// screens/accounts/AccountEdit.js
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import FormWrapper from "@/components/FormWrapper";
import { useNavigation } from "expo-router";
import { useRouteInfo, useRouter } from "expo-router/build/hooks";

import HeaderButton from "@/components/HeaderButton";
import { useAuth } from "@/coopsys/auth/AuthProvider";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import SelectDialog from "@/components/inputs/SelectDialog";
import { createSyncManager } from "@/coopsys/db/syncManager";
import {
  RegionModel,
  DistrictModel,
  OfficeModel,
  CommunityModel,
} from "@/coopsys/models";

const regionModel = new RegionModel();
const districtModel = new DistrictModel();
const officeModel = new OfficeModel();
const communityModel = new CommunityModel();

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;

// Field configuration for the account form
const fieldConfig = [
  {
    name: "name",
    type: "text",
    label: "Community Name",
    placeholder: "Enter community name",
    required: true,
  },
];

export default function Edit() {
  const [editDone, setEditDone] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const { user } = useAuth();
  const { callback, setCallback2 } = useActivityResult();
  const syncManager = useRef(null);
  const { data: result } = route.params ?? {};
  const data = result ? JSON.parse(result) : {};
  const [formValues, setFormValues] = useState(data);
  const [region, setRegion] = useState(data?.region);
  const [district, setDistrict] = useState(data?.district);
  const [office, setOffice] = useState(data?.office);
  const [loading, setLoading] = useState(data?.id);
  const [submitting, setSubmitting] = useState(false);

  const handleCancel = () => {
    router.dismiss();
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      if (data?.id) {
        const newData = {
          ...data,
          ...formValues,
          district_id: district?.server_id,
          region_id: region?.server_id,
          office_id: office?.server_id,
          updated_at: new Date().toISOString(),
        };
        await communityModel.saveRecord(newData);
        callback(newData);
        router.dismiss();
      } else {
        const lastid = (await communityModel.lastId()) + 1;
        const data = {
          id: lastid,
          ...formValues,
          district_id: district?.server_id,
          region_id: region?.server_id,
          office_id: office?.server_id,
          owner: user.owner,
          creator: user.id,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        await communityModel.saveRecord(data);
        handleSuccess(await communityModel.getOneByColumns({ id: lastid }));
      }
    } catch (e) {
      console.log("handleSave", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccess = (data) => {
    router.dismiss();
    router.push({ pathname: "communities/details", params: data });
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: route.params?.data ? formValues.name : "New Commumnity",
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
      communities: communityModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        manager.sync().catch((err) => {
          console.log("sync error", err);
        });
        if (data) {
          setRegion(
            await regionModel.getOneByColumns({ server_id: data.region_id })
          );
          setDistrict(
            await districtModel.getOneByColumns({ server_id: data.district_id })
          );
          setOffice(
            await officeModel.getOneByColumns({ server_id: data.office_id })
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  // validate inputs
  useEffect(() => {
    setEditDone(region && district && office && formValues?.name);
  }, [region, district, office, formValues]);

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

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

  const handleOfficeMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/offices",
      { selected: office ? [office.id] : [] }
    );
    if (data && data.length > 0) {
      setOffice(data[0]);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <FormWrapper
        formValues={formValues}
        handleChange={handleChange}
        fieldConfig={fieldConfig}
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
          value={district ? `${district.name} ${district.category}` : null}
          onPress={handleDistrictMenu}
        />
        <SelectDialog
          loading={loading}
          label={"Select Office"}
          placeholder={"Select a Office"}
          value={office?.name}
          onPress={handleOfficeMenu}
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
