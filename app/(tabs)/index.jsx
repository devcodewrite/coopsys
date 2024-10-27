import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Card, Icon } from "@rneui/themed";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useFocusEffect, useRouter } from "expo-router";
import { createSyncManager } from "@/coopsys/db/syncManager";
import {
  AccountModel,
  CommunityModel,
  OfficeModel,
  PassbookModel,
  AssociationModel,
} from "@/coopsys/models";
import settingModel from "@/coopsys/models/settingModel";

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;

// Define the dashboard items with titles for grouping
const dashboardItems = [
  {
    group: "Finance Overview",
    items: [
      {
        title: "Collections",
        uri: "collections/list",
        name: "collections",
        icon: "sack-dollar",
      },
      {
        title: "Withdrawals",
        uri: "withdrawals/list",
        name: "withdrawals",
        icon: "money-bill-transfer",
      },
    ],
  },
  {
    group: "Member Management",
    items: [
      {
        title: "Accounts",
        uri: "accounts/list",
        name: "accounts",
        icon: "people-group",
      },
      {
        title: "Passbooks",
        uri: "passbooks/list",
        name: "passbooks",
        icon: "address-book",
      },
      {
        title: "Associations",
        uri: "associations/list",
        name: "associations",
        icon: "users-rectangle",
      },
    ],
  },
  {
    group: "Organizational Units",

    items: [
      {
        title: "Offices",
        uri: "offices/list",
        name: "offices",
        icon: "landmark",
      },
      {
        title: "Communities",
        uri: "communities/list",
        name: "communities",
        icon: "earth-africa",
      },
      {
        title: "Farm Lands",
        uri: "farms/list",
        name: "farms",
        icon: "border-none",
      },
    ],
  },
];
const models = {
  accounts: new AccountModel(),
  passbooks: new PassbookModel(),
  associations: new AssociationModel(),
  offices: new OfficeModel(),
  communities: new CommunityModel(),
};
const DashboardScreen = () => {
  const router = useRouter();
  const [totals, setTotals] = useState({
    collections: 0,
    withdrawals: 0,
    members: 0,
    passbooks: 0,
    associations: 0,
    offices: 0,
    farmlands: 0,
    communities: 0,
  });
  const syncManager = useRef(null);
  const filterValues = {};

  useEffect(() => {
    createSyncManager(baseUrl, models)
      .then(async (manager) => {
        syncManager.current = manager;
        updateStats();
        handleSync(manager);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      syncManager.current && handleSync(syncManager.current);
      return () => {};
    }, [])
  );

  const handleSync = (manager) => {
    manager
      .sync()
      .catch((err) => {
        console.log("sync error", err);
      })
      .finally(updateStats);
  };
  const updateStats = async () => {
    try {
      const organization = JSON.parse(
        await settingModel.getSetting("organization")
      );
      filterValues.orgid = organization.orgid;
      const accounts = await models.accounts.countByColumns(filterValues);
      const passbooks = await models.passbooks.countByColumns(filterValues);
      const associations = await models.associations.countByColumns(
        filterValues
      );
      const offices = await models.offices.countByColumns(
        filterValues
      );
      const communities = await models.communities.countByColumns();

      setTotals({ accounts, communities, associations, passbooks,offices });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={dashboardItems}
        extraData={totals}
        keyExtractor={(item) => item.group}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.groupTitle}>{item.group}</Text>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={item.items}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <DashboardCard
                  title={item.title}
                  total={totals[item.name] ?? 0}
                  icon={item.icon}
                  uri={item.uri}
                />
              )}
              numColumns={2}
              columnWrapperStyle={styles.row}
            />
          </View>
        )}
        ListFooterComponent={<View style={styles.space} />}
      />
    </View>
  );
};

// DashboardCard Component for displaying each card
const DashboardCard = ({ title, total, icon, uri }) => {
  return (
    <TouchableOpacity
      onPress={() => router.push(uri)}
      style={styles.cardTouchable}
    >
      <Card containerStyle={styles.cardContainer}>
        <View style={{ width: "100%", alignItems: "center" }}>
          <FontAwesome6 name={icon} size={28} />
        </View>
        <Card.Title>{title}</Card.Title>
        <Card.Divider />
        <Text style={styles.cardText}>Total: {total}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  space: {
    padding: 20,
  },
  list: {
    padding: 16,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 8,
    color: "#333",
  },
  row: {
    justifyContent: "space-between",
  },
  cardTouchable: {
    flex: 1,
    margin: 8,
  },
  cardContainer: {
    flex: 3,
    borderRadius: 8,
    elevation: 3,
    maxHeight: 140,
  },
  cardText: {
    fontSize: 16,
    textAlign: "center",
    marginVertical: 4,
  },
});

export default DashboardScreen;
