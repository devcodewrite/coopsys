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

  const handleDone = () => {
    const formData = {
      passbook: passbook,
      account_id: accountItem.id,
      association_id: associationItem.id,
      account_types: typesItem,
    };
    console.log(formData);
  };
  const handleCancel = () => {
    navigation.goBack();
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
          disabled={!editDone}
          onPress={handleDone}
        />
      ),
    });
  }, [navigation, editDone]);

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
