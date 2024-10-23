// screens/accounts/AccountEdit.js
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import FormWrapper from "@/components/FormWrapper";
import { useNavigation } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import HeaderButton from "@/components/HeaderButton";
import { OFFICE_DATA } from "@/constants/Resources";
import { validateInput } from "@/components/inputs/TextInput";

// Field configuration for the account form
const fieldConfig = [
  {
    name: "office_id",
    type: "select",
    label: "Office",
    placeholder: "Select a Cluster/Office",
    required: true,
    options: OFFICE_DATA.map((item) => ({
      label: item.name,
      value: item.id,
    })),
  },
  {
    name: "name",
    type: "text",
    label: "Community Name",
    placeholder: "Enter community name",
    required: true,
  },
];

export default function Edit() {
  const [editDone, setEditDone] = useState(false);
  const navigation = useNavigation();
  const route = useRouteInfo();

  const { data } = route.params?.data || { data: {} };
  const [formValues, setFormValues] = useState(data);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSave = (formValues) => {
    console.log("Saved data: ", formValues);
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: route.params?.data ? formValues.name : "New Commumnity",
      headerLeft: () => (
        <HeaderButton bolded={false} title={"Cancel"} onPress={handleCancel} />
      ),
      headerRight: () => (
        <HeaderButton
          title={"Save"}
          disabled={!editDone}
          onPress={handleSave}
        />
      ),
    });
  }, [navigation, editDone]);

  // validate inputs
  useEffect(() => {
    for (const index in fieldConfig) {
      const field = fieldConfig[index];
      const valid = validateInput(
        formValues[field.name],
        field?.regex,
        field?.required,
        field?.label,
        `Invalid ${field.name}`
      );
      setEditDone(!valid);
    }
  }, [formValues]);

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <FormWrapper
        formValues={formValues}
        handleChange={handleChange}
        fieldConfig={fieldConfig}
        containerStyle={{ marginTop: 16, paddingBottom: 30 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
