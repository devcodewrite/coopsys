import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";

// Custom FlatList Component with Text Callback
const CustomFlatList = ({
  data,
  extraData,
  renderItem,
  keyExtractor,
  refreshing = false,
  onRefresh,
  listStyle,
}) => {
  return (
    <FlatList
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      extraData={extraData} // Ensure FlatList re-renders on selection change
      contentContainerStyle={[styles.list, listStyle]}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <Text style={styles.noResultsText}>No results found</Text>
      }
      ListFooterComponent={() => <View style={styles.footerSpace} />}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

// Component Styles
const styles = StyleSheet.create({
  list: {
    margin: 16,
  },
  footerSpace: {
    padding: 20,
  },
  noResultsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});

export default CustomFlatList;
