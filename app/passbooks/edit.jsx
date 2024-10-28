// screens/accounts/AccountEdit.js
import React, { useEffect, useRef, useState } from "react";
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
import {
  AccountModel,
  PassbookModel,
  AssociationModel,
} from "@/coopsys/models";
import { createSyncManager } from "@/coopsys/db/syncManager";
import { useAuth } from "@/coopsys/auth/AuthProvider";
import settingModel from "../../coopsys/models/settingModel";

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;
const accountModel = new AccountModel();
const passbookModel = new PassbookModel();
const associationModel = new AssociationModel();

export default function Edit() {
  const router = useRouter();
  const route = useRouteInfo();
  const navigation = useNavigation();
  const { callback, setCallback2 } = useActivityResult();
  const syncManager = useRef(null);
  const { user } = useAuth();
  const { data: result } = route.params ?? {};
  const data = result ? JSON.parse(result) : {};
  const [account, setAccount] = useState(null);
  const [association, setAssociation] = useState(null);
  const [typesItem, setTypesItem] = useState(null);
  const [editDone, setEditDone] = useState(false);
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
          acnum: account.acnum,
          account_id: account.server_id,
          association_id: association.server_id,
          assoc_code: association.assoc_code,
          updated_at: new Date().toISOString(),
        };
        await passbookModel.saveRecord(newData);

        callback(newData);
        router.dismiss();
      } else {
        const organization = JSON.parse(
          await settingModel.getSetting("organization")
        );
        const lastid = (await passbookModel.lastId()) + 1;
        const data = {
          id: lastid,
          pbnum: null,
          account_id: account.server_id,
          acnum: account.acnum,
          association_id: association.server_id,
          assoc_code: association.assoc_code,
          orgid: organization.orgid,
          owner: user.owner,
          creator: user.id,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        };
        await passbookModel.saveRecord(data);
        handleSuccess(await passbookModel.getOneByColumns({ id: lastid }));
      }
    } catch (e) {
      console.log("handleSave", e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccess = (data) => {
    router.dismiss();
    router.push({ pathname: "passbooks/details", params: data });
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: data?.id ? data.pbnum : "New Passbook",
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
      accounts: accountModel,
      associations: associationModel,
      passbooks: passbookModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        if (data?.id) {
          setAccount(
            await accountModel.getOneByColumns({ server_id: data.account_id })
          );
          setAssociation(
            await associationModel.getOneByColumns({
              server_id: data.association_id,
            })
          );
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  const handleAccountMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/accounts",
      { selected: account ? [account.id] : [] }
    );
    if (data && data.length > 0) {
      setAccount(data[0]);
    }
    validate();
  };

  const handleTypeMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/actypes",
      {
        selected: typesItem ? typesItem.map((item) => item.id) : [],
        multiSelect: true,
      }
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
      { selected: association ? [association.id] : [] }
    );
    if (data && data.length > 0) {
      setAssociation(data[0]);
    }
    validate();
  };

  const validate = () => {
    setEditDone(association && account && typesItem);
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <TextInput
        initialValue={data?.id ? data.pbnum : "Auto assigned"}
        label={"Passbook No."}
        placeholder={"Passbook No."}
        disabled
      />
      <SelectDialog
        label={"Select Association"}
        placeholder={"Select an Association"}
        value={association?.name}
        onPress={handleAssoicationMenu}
      />
      <SelectDialog
        label={"Select Account"}
        placeholder={"Select an Account"}
        value={account?.name}
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
