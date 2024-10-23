// screens/accounts/AccountEdit.js
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import FormWrapper from "@/components/FormWrapper";
import { useNavigation, useRouter } from "expo-router";

import HeaderButton from "@/components/HeaderButton";
import { useRouteInfo } from "expo-router/build/hooks";
import { useActivityResult } from "@/hooks/useNavigateForResult";
import { validateInput } from "@/components/inputs/TextInput";
import api from "@/coopsys/apis/api";
import { useAuth } from "@/coopsys/auth/AuthProvider";
import settingModel from "../../coopsys/models/settingModel";

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;

// Field configuration for the account form
const fieldConfig = [
  { name: "photo", label: "Profile Photo", type: "imagePicker" },
  {
    name: "title",
    type: "select",
    label: "Title",
    placeholder: "Select Title",
    options: [
      { label: "Mr.", value: "mr" },
      { label: "Mrs.", value: "mrs" },
      { label: "Miss", value: "miss" },
      { label: "Dr.", value: "dr" },
      { label: "Prof.", value: "prof" },
    ],
  },
  {
    name: "name",
    type: "text",
    label: "Full Name",
    placeholder: "Enter your full name",
    required: true,
  },
  {
    name: "given_name",
    type: "text",
    label: "Given Name",
    placeholder: "Enter your first name",
    required: true,
  },
  {
    name: "family_name",
    type: "text",
    label: "Family Name",
    placeholder: "Enter your last name",
    required: true,
  },
  {
    name: "sex",
    type: "select",
    label: "Sex",
    placeholder: "Select Sex",
    options: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
      { label: "Other", value: "other" },
    ],
  },
  {
    name: "dateofbirth",
    type: "date",
    label: "Date of Birth",
    placeholder: "Select date of birth",
  },
  {
    name: "marital_status",
    type: "select",
    label: "Marital Status",
    placeholder: "Select Marital Status",
    options: [
      { label: "Single", value: "single" },
      { label: "Married", value: "married" },
      { label: "Divorced", value: "divorced" },
      { label: "Widowed", value: "widowed" },
    ],
  },
  {
    name: "occupation",
    type: "text",
    label: "Occupation",
    placeholder: "Enter the occupation",
  },
  {
    name: "education",
    type: "select",
    label: "Education Level",
    placeholder: "Select Education Level",
    options: [
      { label: "No Education", value: "none" },
      { label: "Primary", value: "primary" },
      { label: "Secondary", value: "secondary" },
      { label: "Tertiary", value: "tertiary" },
      { label: "Postgraduate", value: "postgraduate" },
      { label: "Other", value: "other" },
    ],
  },
  {
    name: "nid_type",
    type: "select",
    label: "National ID Type",
    placeholder: "Select ID Type",
    options: [
      { label: "Passport", value: "passport" },
      { label: "Driver's License", value: "driver_license" },
      { label: "Voter ID", value: "voter_id" },
      { label: "National ID Card", value: "national_id_card" },
    ],
  },
  {
    name: "nid",
    type: "idcard",
    label: "ID Number",
    placeholder: "Enter ID Number",
    regex:
      "^(GHA-[0-9]{9}-[0-9]|[0-9]{3}-[0-9]{8}-[0-9]{5}|[A-Z][0-9]{7}|[0-9]{10})$",
  },
  {
    name: "primary_phone",
    type: "tel",
    label: "Primary Phone",
    placeholder: "Enter primary phone number",
    required: true,
    regex: "^[0-9]{10}$",
  },
  {
    name: "email",
    type: "email",
    label: "Email",
    placeholder: "Enter your email address",
    regex: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
  },
];

export default function EditLayout() {
  const [editDone, setEditDone] = useState(false);
  const navigation = useNavigation();
  const route = useRouteInfo();
  const router = useRouter();
  const { callback } = useActivityResult();
  const { user } = useAuth();

  const { data } = route.params?.data || {
    data: {
      photo: "",
      title: "",
      name: "",
      given_name: "",
      family_name: "",
    },
  };
  const [formValues, setFormValues] = useState(data);

  const handleDone = async () => {
     const organization = JSON.parse(await settingModel.getSetting("organization")||"");
    formValues.community_id = 7;
    formValues.office_id = 8;
    formValues.owner = user.owner;
    formValues.orgid = organization.orgid;

    console.log("form", formValues);

    api
      .post(`${baseUrl}/accounts`, formValues)
      .then(
        (result) => {
          const { data } = result;
          console.log("result", data);
        },
        ({ response }) => {
          const { data } = response;
          console.log("Request Rejected:", data);
        }
      )
      .catch((error) => {
        if (error.code === "ECONNABORTED") {
          console.log("Request timeout error:", error.message);
          throw error;
        } else {
          console.log("An error occurred:", error.message);
        }
      });
  };
  const handleCancel = () => {
    if (callback) {
      callback("Success!");
    }
    router.back();
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: "New Account",
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

  const handleChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };
  useEffect(
    React.useCallback(() => {
      for (let i = 0; i < fieldConfig.length; i++) {
        const field = fieldConfig[i];
        const error = validateInput(
          formValues[field.name],
          field?.regex,
          field?.required,
          field.label,
          "Invalid field"
        );
        if (error) {
          return setEditDone(false);
        }
      }
      setEditDone(true);
    }),
    [formValues]
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={{ paddingBottom: 100 }}>
        <FormWrapper
          formValues={formValues}
          handleChange={handleChange}
          fieldConfig={fieldConfig}
        />
      </View>
    </ScrollView>
  );
}
