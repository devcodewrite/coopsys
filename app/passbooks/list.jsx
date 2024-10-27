import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";

import MainSearchBar from "@/components/MainSearchBar";
import HeaderButton from "@/components/HeaderButton";
import { Ionicons } from "@expo/vector-icons";
import CustomFlatList from "@/components/CustomFlatList";
import CustomListItem from "@/components/CustomListItem";
import { createSyncManager } from "@/coopsys/db/syncManager";
import { PassbookModel } from "@/coopsys/models/passbookModel";

import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import settingModel from "../../coopsys/models/settingModel";

const passbookModel = new PassbookModel();

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
      title: "List of Passbooks",
      headerBackTitle: "Search",
      headerRight: () => (
        <HeaderButton
          onPress={() => navigation.navigate("passbooks/edit")}
          icon={() => <Ionicons color={"blue"} name="add" size={24} />}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    createSyncManager(process.env.EXPO_PUBLIC_COOP_URL, {
      passbooks: passbookModel,
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
        setSearchResults(await passbookModel.search(query, filterValues));
      else
        setSearchResults(await passbookModel.getRecordByColumns(filterValues));
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
        title={item.pbnum}
        onPress={() => handleItemPress(item)}
      />
    );
  };
  // Handler for clicking on a search item
  const handleItemPress = (item) => {
    router.push({ pathname: "passbooks/details", params: item });
  };

  const handleFilter = async () => {
    const result = await navigateForResult(
      setCallback,
      router,
      "menus/filter",
      {
        showAccount: true,
        showPassbook: true,
        selected: filterResult,
      }
    );
    setFilterResult(result);
    if (result) {
      const values = {};
      if (result?.account) values["account_id"] = result?.account?.id;
      if (result?.passbook) values["passbook_id"] = result?.passbook?.id;

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
          handleSync(syncManager.current);
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
