import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { Text } from "@rneui/themed";
import { useRouteInfo } from "expo-router/build/hooks";

import MainSearchBar from "@/components/MainSearchBar";
import HeaderButton from "@/components/HeaderButton";
import SelectableFlatList from "@/components/SelectableFlatList";
import { useActivityResult } from "@/hooks/useNavigateForResult";
import { DistrictModel } from "@/coopsys/models/districtModel";
import { createSyncManager } from "@/coopsys/db/syncManager";

const districtModel = new DistrictModel();

const MenuLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const route = useRouteInfo();
  const { callback2 } = useActivityResult();

  const { data } = route.params ?? {};
  const { multiSelect, selected, regionId } = data ? JSON.parse(data) : {};

  const [selectedItems, setSelectedItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
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
      districts: districtModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        handleSync(manager);
        setSearchResults(
          await districtModel.getRecordByColumns({ region_id: regionId })
        );
      })
      .catch((err) => {
        console.log("err", err);AS
      });
  }, []);

  const handleSync = (manager) => {
    manager.sync().catch((err) => {
      console.log("sync error", err);
    });
  };
  // Function to handle search
  const handleSearch = async (query) => {
    if (query)
      setSearchResults(
        await districtModel.search(query, { region_id: regionId })
      );
    else
      setSearchResults(
        await districtModel.getRecordByColumns({ region_id: regionId })
      );

    syncManager.current && handleSync(syncManager.current);
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
        renderText={(item) => <Text>{item.name}</Text>}
        placeholder={regionId ? null : "Please select a region first."}
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
