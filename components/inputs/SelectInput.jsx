// components/inputs/SelectInput.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Button, Icon } from "@rneui/themed";
import Modal from "react-native-modal";
import { Picker } from "@react-native-picker/picker";

const SelectInput = ({ label, value, onChange, placeholder, options }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  // Get the currently selected label to display in the button
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View style={styles.container}>
      {/* Display button for the selected value */}
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.selectedValueButton}
        onPress={() => setModalVisible(true)}
      >
        {selectedOption ? (
          <Text style={styles.selectedValueText}>{selectedOption.label}</Text>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
        <Icon name="chevron-down" type="feather" />
      </TouchableOpacity>

      {/* Modal with the Picker component */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>{placeholder}</Text>
          <Picker
            selectedValue={value}
            onValueChange={(itemValue) => {
              onChange(itemValue);
              setModalVisible(false);
            }}
            style={styles.picker}
          >
            {options.map((option) => (
              <Picker.Item
                label={option.label}
                value={option.value}
                key={option.label}
              />
            ))}
          </Picker>
          <Button
            onPress={() => {
              onChange(options[0] ? options[0].value : null);
              setModalVisible(false);
            }}
            title={"Ok"}
            type="clear"
          />
        </View>
      </Modal>
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
  modal: {
    justifyContent: "center",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  picker: {
    width: "100%",
    height: 200,
  },
});

export default SelectInput;
