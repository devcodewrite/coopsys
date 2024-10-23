// screens/accounts/AccountEdit.js
import React, { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import FormWrapper from "@/components/FormWrapper";
import { useNavigation } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import HeaderButton from "@/components/HeaderButton";
import { validateInput } from "@/components/inputs/TextInput";
import { COMMUN_DATA, OFFICE_DATA } from "@/constants/Resources";
// Field configuration for the account form
const fieldConfig = [
  {
    name: "office_id",
    type: "select",
    label: "Office",
    placeholder: "Select a Cluster/Office",
    required: true,
    options: OFFICE_DATA.map((item) => ({ label: item.name, value: item.id })),
  },
  {
    name: "community_id",
    type: "select",
    label: "Community",
    placeholder: "Select Community",
    required: true,
    options: COMMUN_DATA.map((item) => ({ label: item.name, value: item.id })),
  },
  {
    name: "name",
    type: "text",
    label: "Group Name",
    placeholder: "Enter Group Name",
    required: true,
  },
];

export default function Edit() {
  const [editDone, setEditDone] = useState(false);
  const navigation = useNavigation();
  const route = useRouteInfo();

  const { data } = route.params?.data || { data: {} };
  const [formValues, setFormValues] = useState(data);

  const handleDone = () => {};
  const handleCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: route.params?.data ? formValues.name : "New Association",
      headerLeft: () => (
        <HeaderButton bolded={false} title={"Cancel"} onPress={handleCancel} />
      ),
      headerRight: () => (
        <HeaderButton
          title={"Save"}
          disabled={!editDone}
          onPress={handleDone}
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
        fieldConfig={fieldConfig}
        handleChange={handleChange}
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
