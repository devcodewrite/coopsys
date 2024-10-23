import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Card, Icon } from "@rneui/themed";
import { FontAwesome6 } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";

// Sample data for totals
const totals = {
  collections: 120,
  withdrawals: 45,
  members: 300,
  passbooks: 180,
  associations: 12,
  clusters: 8,
  farmlands: 25,
  communities: 3,
};

// Define the dashboard items with titles for grouping
const dashboardItems = [
  {
    group: "Finance Overview",
    items: [
      {
        title: "Collections",
        uri: "collections/list",
        total: totals.collections,
        icon: "sack-dollar",
      },
      {
        title: "Withdrawals",
        uri: "withdrawals/list",
        total: totals.withdrawals,
        icon: "money-bill-transfer",
      },
    ],
  },
  {
    group: "Member Management",
    items: [
      {
        title: "Members/Accounts",
        uri: "accounts/list",
        total: totals.members,
        icon: "people-group",
      },
      {
        title: "Passbooks",
        uri: "passbooks/list",
        total: totals.passbooks,
        icon: "address-book",
      },
      {
        title: "Associations",
        uri: "associations/list",
        total: totals.associations,
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
        total: totals.clusters,
        icon: "landmark",
      },
      {
        title: "Communities",
        uri: "communities/list",
        total: totals.communities,
        icon: "earth-africa",
      },
      {
        title: "Farm Lands",
        uri: "farms/list",
        total: totals.farmlands,
        icon: "border-none",
      },
    ],
  },
];

const DashboardScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        showsVerticalScrollIndicator={false}
        data={dashboardItems}
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
                  total={item.total}
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
