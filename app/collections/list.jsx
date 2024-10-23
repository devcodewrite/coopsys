import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRouter } from "expo-router";

import MainSearchBar from "@/components/MainSearchBar";
import HeaderButton from "@/components/HeaderButton";
import { Ionicons } from "@expo/vector-icons";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import CustomFlatList from "@/components/CustomFlatList";
import CustomListItem from "@/components/CustomListItem";
import { COLLECTION_DATA } from "@/constants/Resources";

const ListLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [searchResults, setSearchResults] = useState(COLLECTION_DATA);
  const [filterResult, setFilterResult] = useState(null);
  const { setCallback } = useActivityResult();

  useEffect(() => {
    navigation.setOptions({
      title: "List of Collections",
      headerBackTitle: "Search",
      headerRight: () => (
        <HeaderButton
          onPress={() => navigation.navigate("collections/edit")}
          icon={() => <Ionicons color={"blue"} name="add" size={24} />}
        />
      ),
    });
  }, [navigation]);

  // Function to handle search
  const handleSearch = (query) => {
    if (query) {
      const filteredData = COLLECTION_DATA.filter((item) =>
        item.date.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredData);
    } else {
      setSearchResults(COLLECTION_DATA);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <CustomListItem
        title={`${item.date} ${item.association_id}`}
        onPress={() => handleItemPress(item)}
      />
    );
  };
  // Handler for clicking on a search item
  const handleItemPress = (item) => {
    router.push({ pathname: "collections/details", params: { id: item.id } });
  };
  const handleFilter = async () => {
    const result = await navigateForResult(
      setCallback,
      router,
      "menus/filter",
      { showAssociation: true, showCommunity: true }
    );
    setFilterResult(result);
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
