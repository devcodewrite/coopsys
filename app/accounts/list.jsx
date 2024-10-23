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
import { ACCOUNT_DATA } from "@/constants/Resources";
import ProfileListItem from "@/components/ProfileListItem";

const ListLayout = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const [searchResults, setSearchResults] = useState(ACCOUNT_DATA);
  const [filterResult, setFilterResult] = useState(null);
  const { setCallback } = useActivityResult();

  useEffect(() => {
    navigation.setOptions({
      title: "List of Accounts",
      headerBackTitle: "Search",
      headerRight: () => (
        <HeaderButton
          onPress={() => navigation.navigate("accounts/edit")}
          icon={() => <Ionicons color={"blue"} name="add" size={24} />}
        />
      ),
    });
  }, [navigation]);

  // Function to handle search
  const handleSearch = (query) => {
    if (query) {
      const filteredData = ACCOUNT_DATA.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredData);
    } else {
      setSearchResults(ACCOUNT_DATA);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <ProfileListItem
        name={item.name}
        url={item.photo}
        given_name={item.given_name}
        family_name={item.family_name}
        passbook={item.id}
        dateJoined={item.date_joined}
        onPress={() => handleItemPress(item)}
      />
    );
  };
  // Handler for clicking on a search item
  const handleItemPress = (item) => {
    router.push({ pathname: "accounts/details", params: { id: item.id } });
  };
  const handleFilter = async () => {
    const result = await navigateForResult(
      setCallback,
      router,
      "menus/filter",
      {
        showAssociation: true,
        showCommunity: true,
        selected: filterResult,
      }
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
