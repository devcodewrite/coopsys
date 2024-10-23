import React, { useState } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import { Header } from "@rneui/themed";

import NumberInput from "./inputs/NumberInput"; // Import the NumberInput component
import HeaderButton from "./HeaderButton";
import SelectDialog from "./inputs/SelectDialog";
import capitalize from "@/scripts/capitalize";

import {
  navigateForResult,
  useActivityResult,
} from "../hooks/useNavigateForResult";
import { useRouter } from "expo-router";

const AddDepositModal = ({ visible, onClose, onAddDeposit }) => {
  const router = useRouter();
  const { setCallback2 } = useActivityResult();
  const [selectedPassbook, setSelectedPassbook] = useState("");
  const [deposits, setDeposits] = useState({}); // State to track deposit amount
  const [passbookItem, setPassbookItem] = useState(null);

  // Reset modal state
  const resetModal = () => {
    setSelectedPassbook("");
    setPassbookItem(null);
    setDeposits([]);
  };

  const handleAddDeposit = () => {
    if (selectedPassbook && deposits) {
      const total = Object.keys(deposits).reduce(
        (prevVal, name) => deposits[name] + prevVal,
        0
      );

      onAddDeposit(selectedPassbook, deposits, total);
      resetModal();
    }
  };

  const handlePassbookMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/passbooks",
      { selected: passbookItem ? [passbookItem.id] : [] }
    );
    if (data && data.length > 0) {
      setPassbookItem(data[0]);
      setSelectedPassbook(data[0].id);
      const dp = data[0]?.account_types.reduce(
        (prevItem, type) => ({ ...prevItem, [type]: 0 }),
        {}
      );
      setDeposits(dp);
    }
  };

  const handleDepositChange = (name, value) => {
    setDeposits({ ...deposits, [name]: value });
  };

  return (
    <Modal
      visible={visible}
      style={styles.container}
      presentationStyle="pageSheet"
      animationType="slide"
    >
      <Header
        leftComponent={{
          icon: "close",
          color: "#444",
          size: 28,
          onPress: () => {
            onClose();
            resetModal();
          },
        }}
        style={{ height: 50 }}
        centerContainerStyle={{ justifyContent: "center" }}
        backgroundColor="#fff"
        rightComponent={
          <HeaderButton
            disabled={!(passbookItem && passbookItem.length !== 0)}
            onPress={handleAddDeposit}
            title={"ADD"}
          />
        }
        centerComponent={{ text: "Add Deposit", style: styles.modalTitle }}
      />
      <View style={styles.modalContainer}>
        <SelectDialog
          label={"Select a Passbook"}
          placeholder={"Select a Passbook"}
          value={passbookItem?.id}
          onPress={handlePassbookMenu}
        />
        {passbookItem?.account_types.map((item, key) => (
          <NumberInput
            style={styles.input}
            key={key}
            initialValue={deposits[item] ?? 0}
            minValue={0}
            maxValue={10000000000}
            step={10}
            label={`${capitalize(item)} Amount`}
            onValueChange={(val) => handleDepositChange(item, val)} // Update deposit amount state
          />
        ))}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {},
  modalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  modalTitle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#444",
  },
  modalLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    marginTop: 16,
  },
});

export default AddDepositModal;
