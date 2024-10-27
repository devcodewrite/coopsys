import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";

import MainSearchBar from "@/components/MainSearchBar";
import HeaderButton from "@/components/HeaderButton";
import { Ionicons } from "@expo/vector-icons";
import { useActivityResult } from "@/hooks/useNavigateForResult";
import CustomFlatList from "@/components/CustomFlatList";
import { createSyncManager } from "@/coopsys/db/syncManager";

import { AccountModel } from "@/coopsys/models/accountModel";
import ProfileListItem from "../../components/ProfileListItem";
import settingModel from "../../coopsys/models/settingModel";

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;
const accountModel = new AccountModel();

const ListLayout = ({ association }) => {
  const router = useRouter();

  const [searchResults, setSearchResults] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [searchValue, setSearchValue] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const syncManager = useRef(null);

  useEffect(() => {
    createSyncManager(baseUrl, {
      accounts: accountModel,
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

  useEffect(() => {
    if (syncManager.current) handleSearch(searchValue);
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
    const organization = JSON.parse(
      await settingModel.getSetting("organization")
    );
    filterValues.orgid = organization.orgid;
    try {
      if (query)
        setSearchResults(await accountModel.search(query, filterValues));
      else
        setSearchResults(await accountModel.getRecordByColumns(filterValues));
    } catch (e) {
      console.log("handleSearch", e);
    } finally {
      setRefresh(false);
    }
    setSearchValue(query);
  };

  const renderItem = ({ item }) => {
    return (
      <ProfileListItem
        name={item.name}
        given_name={item.given_name}
        family_name={item.family_name}
        dateJoined={item.created_at}
        num={item.acnum}
        url={item.photo}
        onPress={() => handleItemPress(item)}
      />
    );
  };
  // Handler for clicking on a search item
  const handleItemPress = (item) => {
    router.push({ pathname: "accounts/details", params: item });
  };

  return (
    <View style={styles.container}>
      <MainSearchBar
        placeholder="Search for records..."
        onSearch={handleSearch}
        style={styles.searchBar}
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
        listStyle={{ margin: 0 }}
      />
    </View>
  );
};

export default ListLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
});
