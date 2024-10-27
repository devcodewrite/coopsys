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
import {
  AssociationModel,
  OfficeModel,
  CommunityModel,
} from "@/coopsys/models";
import settingModel from "../../coopsys/models/settingModel";

const associationModel = new AssociationModel();
const officeModel = new OfficeModel();
const communityModel = new CommunityModel();
const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;

// Field configuration for the account form
const fieldConfig = [
  {
    name: "name",
    type: "text",
    label: "Group Name",
    placeholder: "Enter Group Name",
    required: true,
  },
];

export default function Edit() {
  const [editDone, setEditDone] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const { user } = useAuth();
  const { setCallback2 } = useActivityResult();
  const syncManager = useRef(null);

  const { data } = route.params?.data || { data: {} };
  const [formValues, setFormValues] = useState(data);
  const [community, setCommunity] = useState(data?.community);
  const [office, setOffice] = useState(data?.office);
  const [loading, setLoading] = useState(data?.id);
  const [submitting, setSubmitting] = useState(false);

  const handleCancel = () => {
    router.dismiss();
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      const organization = JSON.parse(
        await settingModel.getSetting("organization")
      );
      const lastid = (await communityModel.lastId()) + 1;
      const data = {
        id: lastid,
        ...formValues,
        community_id: community?.server_id,
        office_id: office?.server_id,
        orgid: organization.orgid,
        owner: user.owner,
        creator: user.id,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      await associationModel.saveRecord(data);
      handleSuccess(await associationModel.getOneByColumns({ id: lastid }));
    } catch (e) {
      console.log("handleSave", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccess = (data) => {
    router.dismiss();
    router.push({ pathname: "associations/details", params: data });
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: route.params?.data ? formValues.name : "New Association",
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
      associations: associationModel,
      offices: officeModel,
      communities: communityModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        manager.sync().catch((err) => {
          console.log("sync error", err);
        });
        if (data) {
          setCommunity(
            await communityModel.getOneByColumns({ id: data.community_id })
          );
          setOffice(await officeModel.getOneByColumns({ id: data.office_id }));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  // validate inputs
  useEffect(() => {
    setEditDone(community && office && formValues?.name);
  }, [community, office, formValues]);

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
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

  const handleCommunityMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/communities",
      { selected: community ? [community.id] : [] }
    );
    if (data && data.length > 0) {
      setCommunity(data[0]);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <FormWrapper
        formValues={formValues}
        fieldConfig={fieldConfig}
        handleChange={handleChange}
        containerStyle={{ marginTop: 16, paddingBottom: 30 }}
      />
      <View style={{ marginHorizontal: 16 }}>
        <SelectDialog
          loading={loading}
          label={"Select Office"}
          placeholder={"Select a Office"}
          value={office?.name}
          onPress={handleOfficeMenu}
        />
        <SelectDialog
          loading={loading}
          label={"Select Community"}
          placeholder={"Select a community"}
          value={community?.name}
          onPress={handleCommunityMenu}
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
