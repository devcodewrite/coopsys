import MainSearchBar from "@/components/MainSearchBar";
import { Text } from "@rneui/themed";
import { ListItem, Icon } from "@rneui/themed";
import { router, Tabs } from "expo-router";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { FlatList, StyleSheet, View } from "react-native";
import { DATA } from "@/constants/Resources";


export default function SearchScreen() {
  const [searchResults, setSearchResults] = useState(DATA);

  // Function to handle search
  const handleSearch = (query) => {
    if (query) {
      const filteredData = DATA.filter((item) =>
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filteredData);
    } else {
      setSearchResults(DATA);
    }
  };

  // Handler for clicking on a search item
  const handleItemPress = async (item) => {
    router.push(`${item.id}/list`);
  };

  return (
    <View style={styles.container}>
      <Tabs.Screen
        options={{
          headerTitle: (props) => (
            <MainSearchBar
              placeholder="Search for records..."
              onSearch={handleSearch}
              style={styles.searchBar}
            />
          ),
          headerTitleContainerStyle: { width: "100%" },
          headerBackgroundContainerStyle: { height: 100 },
        }}
      />
      {/* Display Search Results */}
      <FlatList
        data={searchResults}
        contentContainerStyle={styles.list}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title style={styles.resultText}>
                  {item.title}
                </ListItem.Title>
              </ListItem.Content>
              {/* Right-side Icon */}
              <Icon name="chevron-right" size={24} color="#000" />
            </ListItem>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.noResultsText}>No results found</Text>
        }
        ListFooterComponent={() => <View style={styles.footerSpace} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 0,
    marginTop: 10,
  },
  searchBar: {},
  list: {
    margin: 12,
  },
  footerSpace: {
    padding: 20,
  },
  resultItem: {
    padding: 15,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  resultText: {
    fontSize: 16,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});
