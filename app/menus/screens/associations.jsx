import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Text } from "@rneui/themed";

import MainSearchBar from "@/components/MainSearchBar";
import HeaderButton from "@/components/HeaderButton";
import SelectableFlatList from "@/components/SelectableFlatList";
import { useActivityResult } from "@/hooks/useNavigateForResult";
import { useRouteInfo } from "expo-router/build/hooks";
import { AssociationModel } from "@/coopsys/models";
import { createSyncManager } from "@/coopsys/db/syncManager";
import settingModel from "../../../coopsys/models/settingModel";

const associationModel = new AssociationModel();

const MenuLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const { callback2 } = useActivityResult();
  const { data } = route.params ?? {};
  const { multiSelect, selected } = data ? JSON.parse(data) : {};

  const [selectedItems, setSelectedItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [filterResult, setFilterResult] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [loading, setLoading] = useState(false);
  const syncManager = useRef(null);

  const handleSelectItem = (selected) => {
    setSelectedItems(selected);
  };

  const handleNext = () => {
    if (callback2)
      callback2(
        searchResults.filter((item) => selectedItems.includes(item.id))
      );
    router.back();
  };

  const handleCancel = () => {
    if (callback2) callback2([]);
    router.back();
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
      associations: associationModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        handleSearch("");
        handleSync(manager);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  const handleSync = (manager, lastSyncTime = null) => {
    manager
      .sync(lastSyncTime)
      .catch((err) => {
        console.log("sync error", err);
      })
      .finally(async () => {
        handleSearch();
        setLoading(false);
      });
  };

  // Function to handle search
  const handleSearch = async (query) => {
    const organization = JSON.parse(
      await settingModel.getSetting("organization")
    );
    filterValues.orgid = organization.orgid;
    try {
      if (query)
        setSearchResults(await associationModel.search(query, filterValues));
      else
        setSearchResults(
          await associationModel.getRecordByColumns(filterValues)
        );
    } catch (e) {
      console.log("handleSearch", e);
    } finally {
      setLoading(false);
    }
    setSearchValue(query);
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
        data={searchResults}
        selectedItems={selected}
        onSelectItem={handleSelectItem}
        refreshing={loading}
        onRefresh={() => {
          setLoading(true);
          handleSync();
        }}
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
