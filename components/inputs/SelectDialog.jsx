// components/inputs/SelectInput.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Icon } from "@rneui/themed";

const SelectDialog = ({
  label,
  value,
  onPress,
  placeholder,
  loading = false,
}) => {
  return (
    <View style={styles.container}>
      {/* Display button for the selected value */}
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selectedValueButton} onPress={onPress}>
        {value ? (
          <Text style={styles.selectedValueText}>{value}</Text>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        {loading ? (
          <ActivityIndicator animating size={"small"} />
        ) : (
          <Icon name="chevron-down" type="feather" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  selectedValueButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  selectedValueText: {
    fontSize: 16,
  },

  placeholder: {
    fontSize: 16,
    paddingHorizontal: 8,
    color: "gray",
  },

  label: {
    fontSize: 16,
    fontWeight: "200",
    paddingHorizontal: 8,
    color: "#aaa",
  },
});

export default SelectDialog;
