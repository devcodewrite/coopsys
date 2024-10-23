// components/FormWrapper.js
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import TextInput from "./inputs/TextInput";
import SelectInput from "./inputs/SelectInput";
import ButtonGroupInput from "./inputs/ButtonGroupInput";
import ImagePickerInput from "./inputs/ImagePickerInput";
import SingleDatePicker from "./inputs/SingleDatePicker";

const FormWrapper = ({
  formValues,
  handleChange = (name, value) => {},
  fieldConfig,
  containerStyle,
}) => {
  // Render the right input type based on the field config
  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <TextInput
            key={field.name}
            label={field.label}
            initialValue={formValues[field.name] ?? ""}
            onChange={(value) => handleChange(field.name, value)}
            required={field?.required}
            placeholder={field.placeholder}
          />
        );
      case "email":
        return (
          <TextInput
            inputMode={"email"}
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={formValues[field.name] ?? ""}
            onChange={(value) => handleChange(field.name, value)}
            required={field?.required}
            regex={field?.regex}
            errorMessage="Please enter a valid email address"
          />
        );

      case "tel":
        return (
          <TextInput
            inputMode={"tel"}
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={formValues[field.name] ?? ""}
            onChange={(value) => handleChange(field.name, value)}
            required={field?.required}
            regex={field?.regex}
            errorMessage="Phone number should be 10 digits"
          />
        );

      case "idcard":
        return (
          <TextInput
            key={field.name}
            label={field.label}
            placeholder={field.placeholder}
            value={formValues[field.name] ?? ""}
            onChange={(value) => handleChange(field.name, value)}
            required={field?.required}
            regex={field?.regex}
            errorMessage="Please enter a valid id number"
          />
        );
      case "select":
        return (
          <SelectInput
            key={field.name}
            label={field.label}
            value={formValues[field.name] ?? ""}
            onChange={(value) => handleChange(field.name, value)}
            options={field.options}
            required={field?.required}
            placeholder={field.placeholder}
          />
        );

      case "buttonGroup":
        return (
          <ButtonGroupInput
            key={field.name}
            label={field.label}
            value={formValues[field.name] ?? ""}
            onChange={(value) => handleChange(field.name, value)}
            options={field.options}
            placeholder={field.placeholder}
          />
        );

      case "imagePicker":
        const fname = formValues?.given_name ?? "",
          lname = formValues?.family_name ?? "";
        return (
          <ImagePickerInput
            title={fname.substring(0, 1) + lname.substring(0, 1)}
            key={field.name}
            label={field.label}
            value={formValues[field.name] ?? ""}
            onImageSelected={(value) => {
              handleChange(field.name, value);
            }}
            options={field.options}
            placeholder={field.placeholder}
          />
        );

      case "date":
        return (
          <SingleDatePicker
            key={field.name}
            label={field.label}
            onDateSelected={(value) => handleChange(field.name, value)}
            required={field?.required}
            placeholder={field.placeholder}
          />
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, containerStyle]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      {fieldConfig.map((field) => renderField(field))}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
  },
  saveButton: {
    marginTop: 20,
  },
});

export default FormWrapper;
