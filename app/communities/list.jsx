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
import { COMMUN_DATA } from "@/constants/Resources";
import CustomListItem from "@/components/CustomListItem";

const ListLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [searchResults, setSearchResults] = useState(COMMUN_DATA);
  const [filterResult, setFilterResult] = useState(null);
  const { setCallback } = useActivityResult();

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

  // Function to handle search
  const handleSearch = (query) => {
    if (query) {
      const filteredData = COMMUN_DATA.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredData);
    } else {
      setSearchResults(COMMUN_DATA);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <CustomListItem title={item.name} onPress={() => handleItemPress(item)} />
    );
  };
  // Handler for clicking on a search item
  const handleItemPress = (item) => {
    router.push({ pathname: "associations/details", params: { id: item.id } });
  };
  const handleFilter = async () => {
    const result = await navigateForResult(
      setCallback,
      router,
      "menus/filter",
      { showOffice: true, selected: filterResult }
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
