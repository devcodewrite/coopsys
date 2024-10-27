import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Text } from "@rneui/themed";
import { useRouteInfo } from "expo-router/build/hooks";

import MainSearchBar from "@/components/MainSearchBar";
import HeaderButton from "@/components/HeaderButton";
import SelectableFlatList from "@/components/SelectableFlatList";
import { useActivityResult } from "@/hooks/useNavigateForResult";
import { OrganizationModel } from "@/coopsys/models/organizationModel";
import { createSyncManager } from "@/coopsys/db/syncManager";
import { useAuth } from "@/coopsys/auth/AuthProvider";
import api from "@/coopsys/apis/api";

const organizationModel = new OrganizationModel();
const coopBaseUrl = process.env.EXPO_PUBLIC_COOP_URL;

const MenuLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const { callback2 } = useActivityResult();
  const { user } = useAuth();

  const { data } = route.params ?? {};
  const { multiSelect, selected } = data ? JSON.parse(data) : {};

  const [selectedItems, setSelectedItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const syncManager = useRef(null);

  const handleSelectItem = (selected) => {
    setSelectedItems(selected);
  };

  const handleNext = () => {
    if (callback2)
      callback2(
        searchResults.filter((item) => selectedItems.includes(item.orgid))
      );
    router.dismiss(1);
  };
  const handleCancel = () => {
    if (callback2) callback2([]);
    router.dismiss();
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: "",
      headerLeft: () => (
        <HeaderButton bolded={false} title={"Cancel"} onPress={handleCancel} />
      ),
      headerRight: () => (
        <HeaderButton
          title={"Done"}
          disabled={!selectedItems.length}
          onPress={handleNext}
        />
      ),
    });
  }, [navigation, selectedItems]);

  useEffect(() => {
    createSyncManager(process.env.EXPO_PUBLIC_COOP_URL, {
      regions: organizationModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        setSearchResults(await organizationModel.getAllRecords());
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  // Function to handle search
  const handleSearch = async (query) => {
    if (query) setSearchResults(await organizationModel.search(query));
    else setSearchResults(await organizationModel.getAllRecords());
  };

  const handleFetch = () => {
    api
      .get(`${coopBaseUrl}/organizations?filters[owner]=${user.owner}`)
      .then(
        async (result) => {
          const { data } = result;
          if (data.status) {
            await organizationModel.saveChanges(data.data);
            setSearchResults(await organizationModel.getAllRecords());
          }
        },
        ({ response }) => {
          const { data } = response;
          console.log("Request Rejected:", data);
        }
      )
      .catch((error) => {
        if (error.code === "ECONNABORTED") {
          console.log("Request timeout error:", error.message);
        } else {
          console.log("An error occurred:", error.message);
        }
      });
  };

  return (
    <View style={styles.container}>
      <MainSearchBar
        placeholder="Search for records..."
        onSearch={handleSearch}
        style={styles.searchBar}
      />
      {/* Display Search Results */}
      <SelectableFlatList
        multiSelect={multiSelect}
        data={searchResults.map((item) => ({ ...item, id: item.orgid }))}
        selectedItems={selected}
        onSelectItem={handleSelectItem}
        onRefresh={handleFetch}
        refreshing={loading}
        renderText={(item) => <Text>{item.name}</Text>}
      />
    </View>
  );
};

export default MenuLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 0,
    marginTop: 10,
  },
});
