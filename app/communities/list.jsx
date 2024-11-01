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
import CustomFlatList from "@/components/CustomFlatList";
import CustomListItem from "@/components/CustomListItem";
import { createSyncManager } from "@/coopsys/db/syncManager";
import { CommunityModel } from "@/coopsys/models/communityModel";

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;
const communityModel = new CommunityModel();

const ListLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState([]);
  const [searchValue, setSearchValue] = useState(null);
  const [filterResult, setFilterResult] = useState({});
  const [filterValues, setFilterValues] = useState({});
  const [refresh, setRefresh] = useState(false);
  const { setCallback } = useActivityResult();
  const syncManager = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: "List of Communities",
      headerBackTitle: "Search",
      headerRight: () => (
        <HeaderButton
          onPress={() => navigation.navigate("communities/edit")}
          icon={() => <Ionicons color={"blue"} name="add" size={24} />}
        />
      ),
    });
  }, [navigation]);

  useEffect(() => {
    createSyncManager(baseUrl, {
      communities: communityModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        handleSync(manager);
        handleSearch(searchValue);
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => setRefresh(false));
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
    try {
      if (query)
        setSearchResults(await communityModel.search(query, filterValues));
      else
        setSearchResults(await communityModel.getRecordByColumns(filterValues));
    } catch (e) {
      console.log(e);
    } finally {
      setRefresh(false);
    }
    setSearchValue(query);
  };

  const renderItem = ({ item }) => {
    return (
      <CustomListItem
        title={item.name}
        subtitle={item.com_code}
        isSynced={!!item.server_id}
        onPress={() => handleItemPress(item)}
      />
    );
  };
  // Handler for clicking on a search item
  const handleItemPress = (item) => {
    router.push({ pathname: "communities/details", params: item });
  };
  const handleFilter = async () => {
    const result = await navigateForResult(
      setCallback,
      router,
      "menus/filter",
      {
        showOffice: true,
        showRegion: true,
        showDistrict: true,
        selected: filterResult,
      }
    );
    setFilterResult(result);
    const values = {};
    if (result?.region) values.region_id = result.region.id;
    if (result?.district) values.district_id = result.district.id;
    if (result?.office) values.office_id = result.office.id;

    setFilterValues(values);
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
