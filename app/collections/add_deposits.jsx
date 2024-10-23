import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useNavigation, useRouter } from "expo-router";

import AddDepositModal from "@/components/AddDepositModal"; // Import updated modal
import HeaderButton from "@/components/HeaderButton";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";

const AddDepositsScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [deposits, setDeposits] = useState([]); // State for added deposits
  const [isModalVisible, setModalVisible] = useState(false); // State to show/hide modal

  useEffect(() => {
    navigation.setOptions({
      presentation: "fullScreenModal",
      title: "Collection Data",
      headerLeft: () => (
        <HeaderButton bolded={false} title={"Cancel"} onPress={handleCancel} />
      ),
      headerRight: () => (
        <HeaderButton
          onPress={() => setModalVisible(true)}
          icon={<Ionicons name="add" size={24} />}
        />
      ),
    });
  }, [navigation]);
  const handleCancel = () => {
    router.back();
  };

  // Handler to add a deposit (called from AddDepositModal)
  const addDeposit = (passbook, amounts, total) => {
    const newDeposit = {
      id: passbook, // Unique ID for each deposit
      passbook: passbook,
      amounts: amounts,
      total: total,
    };

    setDeposits((prevDeposits) => {
      // Check if the deposit with the same ID exists and update it, otherwise add a new deposit
      const depositExists = prevDeposits.some(
        (deposit) => deposit.id === passbook
      );

      if (depositExists) {
        // Update the existing deposit with the new amount
        return prevDeposits.map((deposit) =>
          deposit.id === passbook
            ? { ...deposit, amounts: amounts, total: total }
            : deposit
        );
      } else {
        // Add a new deposit if it doesn't exist
        return [...prevDeposits, newDeposit];
      }
    });

    setModalVisible(false); // Close the modal after adding/updating
  };

  // Render each deposit item in the list
  const renderDepositItem = ({ item }) => {
    return (
      <View style={styles.depositItem}>
        <Text style={styles.depositText}>Passbook: {item.passbook}</Text>
        {Object.keys(item.amounts).map((name, key) => (
          <Text key={key} style={styles.depositText}>
            {name}:{" "}
            {Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(
              item.amounts[name]
            )}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* List of added deposits */}
      <FlatList
        data={deposits}
        renderItem={renderDepositItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <Feather name="folder" color={"gray"} size={100} />
            <Text style={styles.noDeposits}>No deposits added yet.</Text>
          </View>
        }
        contentContainerStyle={styles.depositList}
      />

      {/* Display the total amount at the bottom */}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Amount:{" "}
          {Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(
            deposits.reduce((total, item) => total + item.total, 0)
          )}
        </Text>
        <Button title={"Submit Collection"} radius={8} raised />
      </View>

      {/* Updated AddDepositModal component */}
      <AddDepositModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onAddDeposit={addDeposit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  depositList: {
    paddingHorizontal: 16,
  },
  emptyList: {
    justifyContent: "center",
    alignItems: "center",
    height: 400,
  },
  noDeposits: {
    textAlign: "center",
    fontSize: 18,
    color: "#888",
  },
  depositItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  depositText: {
    fontSize: 16,
  },
  totalContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
});

export default AddDepositsScreen;
