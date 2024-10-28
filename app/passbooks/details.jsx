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
import { AssociationModel, AccountModel } from "@/coopsys/models";
import moment from "moment";

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;
const associationModel = new AssociationModel();
const accountModel = new AccountModel();

const DetailsLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const syncManager = useRef(null);
  const { setCallback } = useActivityResult();
  const [data, setData] = useState(route.params);
  const [account, setAccount] = useState(null);
  const [association, setAssociation] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: data.pbnum || "Passbook",
      headerRight: () => <HeaderButton title={"Edit"} onPress={handleEdit} />,
    });
  }, [navigation, route]);

  const handleEdit = async () => {
    const result = await navigateForResult(
      setCallback,
      router,
      "passbooks/edit",
      data
    );
    setData(result);
  };

  useEffect(() => {
    createSyncManager(baseUrl, {
      accounts: accountModel,
      associations: associationModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        setAssociation(
          await associationModel.getOneByColumns({
            server_id: data.association_id,
          })
        );
        setAccount(
          await accountModel.getOneByColumns({ server_id: data.account_id })
        );
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [data]);

  if (!data) return;

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.subContainer}>
          <Text style={styles.title}>{account?.name}</Text>
          <Text style={styles.subtitle}>{data.pbnum}</Text>
          <Text style={styles.date}>
            Added on: {moment(data.created_at).format("DD/MM/YYYY")}
          </Text>
        </View>
      </View>

      <View style={styles.middleContainer}>
        <Label
          data={[
            {
              title: "Account",
              value: account?.name,
              icon: { name: "user", type: "font-awesome" },
            },
            {
              title: "Account Number",
              value: data.acnum,
              icon: { name: "bookmark", type: "ionicon" },
            },
            {
              title: "Association",
              value: association?.name,
              icon: { name: "groups" },
            },
          ]}
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
    paddingTop: 16,
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
    marginHorizontal: 16,
    marginVertical: 16,
  },
});
