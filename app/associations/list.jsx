import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";

import MainSearchBar from "@/components/MainSearchBar";
import HeaderButton from "@/components/HeaderButton";
import { Ionicons } from "@expo/vector-icons";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import { useAuth } from "@/coopsys/auth/AuthProvider";
import CustomFlatList from "@/components/CustomFlatList";
import CustomListItem from "@/components/CustomListItem";
import { createSyncManager } from "@/coopsys/db/syncManager";
import { AssociationModel } from "@/coopsys/models/associationModel";
import settingModel from "../../coopsys/models/settingModel";

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;
const associationModel = new AssociationModel();

const ListLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const { setCallback } = useActivityResult();
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [filterResult, setFilterResult] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [refresh, setRefresh] = useState(false);
  const syncManager = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: "List of Associations",
      headerBackTitle: "Search",
      headerRight: () => (
        <HeaderButton
          onPress={() => navigation.navigate("associations/edit")}
          icon={() => <Ionicons color={"blue"} name="add" size={24} />}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    createSyncManager(baseUrl, {
      associations: associationModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        handleSync(manager);
        handleSearch("");
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
        setSearchResults(await associationModel.search(query, filterValues));
      else
        setSearchResults(
          await associationModel.getRecordByColumns(filterValues)
        );
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
        subtitle={item.assoc_code}
        onPress={() => handleItemPress(item)}
      />
    );
  };
  // Handler for clicking on a search item
  const handleItemPress = (item) => {
    router.push({ pathname: "associations/details", params: item });
  };
  const handleFilter = async () => {
    const result = await navigateForResult(
      setCallback,
      router,
      "menus/filter",
      {
        showOffice: true,
        showCommunity: true,
        selected: filterResult,
      }
    );
    setFilterResult(result);
    if (result) {
      const values = {};
      if (result?.office) values["office_id"] = result?.office?.id;
      if (result?.community) values["community_id"] = result?.community?.id;

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
