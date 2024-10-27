import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";

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
import settingModel from "../../coopsys/models/settingModel";

const officeModel = new OfficeModel();

const ListLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const { setCallback } = useActivityResult();
  const [filterResult, setFilterResult] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState(null);

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
        handleSearch(searchValue);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, [filterValues]);

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
      .finally(() => handleSearch(searchValue));
  };

  // Function to handle search
  const handleSearch = async (query) => {
    try {
      const organization = JSON.parse(
        await settingModel.getSetting("organization")
      );
      filterValues.orgid = organization.orgid;

      if (query)
        setSearchResults(await officeModel.search(query, filterValues));
      else setSearchResults(await officeModel.getRecordByColumns(filterValues));
    } catch (e) {
      console.log("handleSearch", e);
    } finally {
      setRefresh(false);
    }
    setSearchValue(query);
  };

  const renderItem = ({ item }) => {
    return (
      <CustomListItem
        title={item.name}
        subtitle={item.off_code}
        isSynced={!!item.server_id}
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

      setFilterValues(values);
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
          handleSearch(searchValue);
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
