// components/CustomSearchBar.js
import React, { PropsWithChildren, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Icon, SearchBar } from "@rneui/themed";

const MainSearchBar = ({
  placeholder,
  onSearch,
  style,
  showFilterButton,
  onFilterPress,
}: PropsWithChildren & {
  placeholder: string;
  onSearch: (value: string) => void;
  style: any;
  showFilterButton: boolean;
  onFilterPress: () => void;
}) => {
  const [query, setQuery] = useState("");
  const [hideFilter, setHideFilter] = useState(false);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (onSearch) {
      onSearch(text);
    }
  };

  return (
    <View
      style={[
        styles.container,
        showFilterButton && styles.containerFilter,
        style,
      ]}
    >
      <SearchBar
        onFocus={() => setHideFilter(true)}
        onBlur={() => setHideFilter(false)}
        placeholder={placeholder || "Search..."}
        value={query}
        onChangeText={handleSearch}
        platform="default" // Options: 'default', 'ios', 'android'
        round
        lightTheme
        containerStyle={[
          styles.searchContainer,
          showFilterButton && styles.searchFilter,
        ]}
        inputContainerStyle={styles.inputContainer}
      />
      {showFilterButton && !hideFilter ? (
        <Button onPress={onFilterPress} type="clear">
          <Icon name="filter" type="font-awesome" />
        </Button>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  containerFilter: {
    flexDirection: "row",
    alignItems: "center",
    paddingEnd: 8,
  },
  searchFilter: {
    flex: 1,
  },
  searchContainer: {
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: {
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    height: 40,
  },
});

export default MainSearchBar;
