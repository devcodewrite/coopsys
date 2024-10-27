// screens/accounts/AccountEdit.js
import React, { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import FormWrapper from "@/components/FormWrapper";
import { useNavigation, useRouter } from "expo-router";

import HeaderButton from "@/components/HeaderButton";
import { useRouteInfo } from "expo-router/build/hooks";
import { validateInput } from "@/components/inputs/TextInput";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import SelectDialog from "@/components/inputs/SelectDialog";
import { createSyncManager } from "@/coopsys/db/syncManager";
import { useAuth } from "@/coopsys/auth/AuthProvider";
import settingModel from "../../coopsys/models/settingModel";
import { AccountModel } from "@/coopsys/models";
import { Platform } from "react-native";

const baseUrl = process.env.EXPO_PUBLIC_COOP_URL;
const accountModel = new AccountModel();

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
  const syncManager = useRef(null);
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
  const [loading, setLoading] = useState(data?.id);
  const [submitting, setSubmitting] = useState(false);

  const handleDone = async () => {
    setSubmitting(true);
    try {
      const organization = JSON.parse(
        (await settingModel.getSetting("organization")) || ""
      );
      const lastid = (await accountModel.lastId()) + 1;

      const data = {
        id: lastid,
        ...formValues,
        orgid: organization.orgid,
        owner: user.owner,
        creator: user?.id,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      await accountModel.saveRecord(data);
      handleSuccess(await accountModel.getOneByColumns({ id: lastid }));
    } catch (e) {
      console.log("handleSave", e);
    } finally {
      setSubmitting(false);
    }
  };
  const handleSuccess = (data) => {
    router.dismiss();
    router.push({ pathname: "accounts/details", params: data });
  };

  const handleCancel = () => {
    router.back();
  };

  useEffect(() => {
    navigation.setOptions({
      presentation: "modal",
      title: data ? "Edit Account" : "New Account",
      headerLeft: () => (
        <HeaderButton bolded={false} title={"Cancel"} onPress={handleCancel} />
      ),
      headerRight: () => (
        <HeaderButton
          title={"Save"}
          disabled={!editDone || submitting}
          onPress={handleDone}
        />
      ),
    });
  }, [navigation, editDone, submitting]);

  useEffect(() => {
    createSyncManager(baseUrl, {
      accounts: accountModel,
    })
      .then(async (manager) => {
        syncManager.current = manager;
        setLoading(false);
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <FormWrapper
          containerStyle={{ paddingBottom: 30 }}
          formValues={formValues}
          handleChange={handleChange}
          fieldConfig={fieldConfig}
        />
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
