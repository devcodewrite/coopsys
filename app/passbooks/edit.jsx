// screens/accounts/AccountEdit.js
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useNavigation } from "expo-router";
import { useRouteInfo, useRouter } from "expo-router/build/hooks";
import HeaderButton from "@/components/HeaderButton";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import SelectDialog from "@/components/inputs/SelectDialog";
import TextInput from "@/components/inputs/TextInput";

export default function Edit() {
  const router = useRouter();
  const route = useRouteInfo();
  const navigation = useNavigation();
  const { setCallback2 } = useActivityResult();

  const { data } = route.params?.data || { data: {} };
  const [passbook, setPassbook] = useState(data?.passbook);
  const [accountItem, setAccountItem] = useState(data?.account);
  const [associationItem, setAssociationItem] = useState(data?.association);
  const [typesItem, setTypesItem] = useState(data?.account_types);
  const [editDone, setEditDone] = useState(false);
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
      title: route.params?.data ? data : "New Passbook",
      headerLeft: () => (
        <HeaderButton bolded={false} title={"Cancel"} onPress={handleCancel} />
      ),
      headerRight: () => (
        <HeaderButton
          title={"Save"}
          disabled={!editDone || submitting}
          onPress={handleDone}
        />
      ),
    });
  }, [navigation, editDone, submitting]);

  const handleAccountMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/accounts",
      { selected: accountItem ? [accountItem.id] : [] }
    );
    if (data && data.length > 0) {
      setAccountItem(data[0]);
    }
    validate();
  };

  const handleTypeMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/actypes",
      { selected: typesItem ? [typesItem.id] : [], multiSelect: true }
    );
    if (data && data.length > 0) {
      setTypesItem(data);
    }
    validate();
  };

  const handleAssoicationMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/associations",
      { selected: associationItem ? [associationItem.id] : [] }
    );
    if (data && data.length > 0) {
      setAssociationItem(data[0]);
    }
    validate();
  };

  const validate = () => {
    setEditDone(associationItem && accountItem && typesItem);
  };

  const getPassbookNumber = () => {
    if (passbook) return passbook;
    const pb = `PB${Math.round(Math.random() * 100)}`;
    setPassbook(pb);
    return pb;
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <TextInput
        initialValue={getPassbookNumber()}
        label={"Passbook No."}
        placeholder={"Passbook No."}
        disabled
      />
      <SelectDialog
        label={"Select Association"}
        placeholder={"Select an Association"}
        value={associationItem?.name}
        onPress={handleAssoicationMenu}
      />
      <SelectDialog
        label={"Select Account"}
        placeholder={"Select an Account"}
        value={accountItem?.name}
        onPress={handleAccountMenu}
      />

      <SelectDialog
        label={"Select Types"}
        placeholder={"Select Types"}
        value={typesItem && typesItem.map((item) => item.name).join(",")}
        onPress={handleTypeMenu}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
