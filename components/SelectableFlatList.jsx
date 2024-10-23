import { MaterialIcons } from "@expo/vector-icons";
import { ListItem } from "@rneui/themed";
import React, { useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

// Custom FlatList Component with Text Callback
const SelectableFlatList = ({
  data,
  multiSelect = false,
  onSelectItem,
  selectedItems = [],
  renderText, // New prop for custom text rendering
  renderItem = null,
  placeholder = null,
  refreshing = false,
  onRefresh,
}) => {
  const [selected, setSelected] = useState(selectedItems);

  // Toggle selection for single or multiple selection
  const handleSelect = (item) => {
    let updatedSelected;
    if (multiSelect) {
      if (selected.includes(item.id)) {
        // Remove item if it's already selected
        updatedSelected = selected.filter((id) => id !== item.id);
      } else {
        // Add item to the selected list
        updatedSelected = [...selected, item.id];
      }
    } else {
      // For single selection, select the current item only
      updatedSelected = selected.includes(item.id) ? [] : [item.id];
    }

    setSelected(updatedSelected);
    onSelectItem && onSelectItem(updatedSelected);
  };

  // Render each item in the FlatList
  const renderSelectItem = ({ item }) => {
    const isSelected = selected.includes(item.id);
    return renderItem ? (
      renderItem
    ) : (
      <TouchableOpacity onPress={() => handleSelect(item)}>
        <ListItem bottomDivider>
          <ListItem.Content style={styles.resultItem}>
            <ListItem.Title
              style={[styles.resultText, isSelected && styles.selectedItem]}
            >
              {/* Render the text using the callback if provided, otherwise use the name property */}
              {renderText ? renderText(item) : item.name}
            </ListItem.Title>
            {isSelected && <MaterialIcons name="check" size={18} />}
          </ListItem.Content>
        </ListItem>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderSelectItem}
      extraData={selected} // Ensure FlatList re-renders on selection change
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text style={styles.noResultsText}>
          {placeholder ? placeholder : `No results found`}
        </Text>
      }
      ListFooterComponent={() => <View style={styles.footerSpace} />}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

// Component Styles
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
  selectedItem: {
    fontWeight: "bold",
  },
  resultItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  resultText: {
    fontSize: 16,
    alignContent: "space-between",
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#888",
  },
});

export default SelectableFlatList;
