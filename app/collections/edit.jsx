import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRouter } from "expo-router";

import SingleDatePicker from "@/components/inputs/SingleDatePicker";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import HeaderButton from "@/components/HeaderButton";
import SelectDialog from "@/components/inputs/SelectDialog";
import { Ionicons } from "@expo/vector-icons";
import { useRouteInfo } from "expo-router/build/hooks";

const CollectionScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const route = useRouteInfo();
  const { setCallback2 } = useActivityResult();

  const { data } = route.params?.data || { data: {} };
  const [editDone, setEditDone] = useState(false);
  const [collectionDate, setCollectionDate] = useState(data?.date); // State for collection date input
  const [associationItem, setAssociationItem] = useState(data?.association);
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      presentation: "fullScreenModal",
      title: route.params?.data ? collectionDate : "New Collection",
      headerLeft: () => (
        <HeaderButton bolded={false} title={"Cancel"} onPress={handleCancel} />
      ),
      headerRight: () => (
        <HeaderButton
          title={"Create"}
          disabled={!editDone}
          onPress={handleSave}
        />
      ),
    });
  }, [navigation, editDone]);

  const handleSave = () => {
    //TODO: Post request to create collection object for adding deposits
    router.push({
      pathname: `collections/add_deposits`,
      params: { collection },
    });
  };
  const handleCancel = () => {
    router.back();
  };

  const handleAssoicationMenu = async () => {
    const data = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/associations",
      { selected: associationItem ? [associationItem.id] : [] }
    );
    if (data && data.length > 0) {
      setAssociationItem(data[0]);
    } else {
      setAssociationItem(null);
    }
  };

  const handleDate = (date) => {
    setCollectionDate(date);
  };

  // validate inputs
  useEffect(() => {
    setEditDone(associationItem && collectionDate !== "");
  }, [collectionDate, associationItem]);

  return (
    <View style={styles.container}>
      <SelectDialog
        label={"Select Association"}
        placeholder={"Select an Association"}
        value={associationItem?.name}
        onPress={handleAssoicationMenu}
      />
      <SingleDatePicker
        label={"Date"}
        placeholder="Set a Date"
        icon={<Ionicons name="calendar" size={24} />}
        onDateSelected={handleDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
    borderRadius: 4,
  },
  depositList: {
    marginTop: 16,
  },
  noDeposits: {
    textAlign: "center",
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
});

export default CollectionScreen;
