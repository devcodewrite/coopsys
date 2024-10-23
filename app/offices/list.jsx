import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";

import MainSearchBar from "@/components/MainSearchBar";
import HeaderButton from "@/components/HeaderButton";
import { Ionicons } from "@expo/vector-icons";
import CustomFlatList from "@/components/CustomFlatList";
import CustomListItem from "@/components/CustomListItem";
import { createSyncManager } from "@/coopsys/db/syncManager";
import { OfficeModel } from "@/coopsys/models/officeModel";

import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";

const officeModel = new OfficeModel();

const ListLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const { setCallback } = useActivityResult();
  const [filterResult, setFilterResult] = useState(null);
  const [filterValue, setFilterValue] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const syncManager = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: "List of Offices",
      headerBackTitle: "Search",
      headerRight: () => (
        <HeaderButton
          onPress={() => navigation.navigate("offices/edit")}
          icon={() => <Ionicons color={"blue"} name="add" size={24} />}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    createSyncManager(process.env.EXPO_PUBLIC_COOP_URL, {
      offices: officeModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        handleSync(manager);
        setSearchResults(await officeModel.getRecordByColumns(filterValue));
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [filterValue]);

  const handleSync = (manager) => {
    manager.sync().catch((err) => {
      console.log("sync error", err);
    });
  };
  // Function to handle search
  const handleSearch = async (query) => {
    try {
      if (query) setSearchResults(await officeModel.search(query, filterValue));
      else setSearchResults(await officeModel.getRecordByColumns(filterValue));
    } catch (e) {
      console.log("handleSearch", e);
    } finally {
      setRefresh(false);
    }
    syncManager.current && handleSync(syncManager.current);
  };

  const renderItem = ({ item }) => {
    return (
      <CustomListItem
        title={item.name}
        subtitle={item.off_code}
        onPress={() => handleItemPress(item)}
      />
    );
  };
  // Handler for clicking on a search item
  const handleItemPress = (item) => {
    router.push({ pathname: "offices/details", params: item });
  };

  const handleFilter = async () => {
    const result = await navigateForResult(
      setCallback,
      router,
      "menus/filter",
      {
        showRegion: true,
        showDistrict: true,
        selected: filterResult,
      }
    );
    setFilterResult(result);
    if (result) {
      const values = {};
      if (result?.region) values["region_id"] = result?.region?.id;
      if (result?.district) values["district_id"] = result?.district?.id;

      setFilterValue(values);
    }
  };

  return (
    <View style={styles.container}>
      <MainSearchBar
        placeholder="Search for records..."
        onSearch={handleSearch}
        style={styles.searchBar}
        showFilterButton
        onFilterPress={handleFilter}
      />
      {/* Display Search Results */}
      <CustomFlatList
        keyExtractor={(item) => item.id.toString()}
        data={searchResults}
        renderItem={renderItem}
        refreshing={refresh}
        onRefresh={() => {
          setRefresh(true);
          handleSearch("");
        }}
      />
    </View>
  );
};

export default ListLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingTop: 10,
  },
});
