// components/inputs/TextInput.js
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Input } from "@rneui/themed";

// Validate input on change
export const validateInput = (text, regex, required, label, errorMessage) => {
  let validationError = "";
  // Required validation
  if (required && !text) {
    validationError = `${label} is required`;
  } else if (required && text.trim() === "") {
    validationError = `${label} is required`;
  }
  // Regex validation (if regex pattern is provided)
  else if (text && regex && !new RegExp(regex).test(text)) {
    validationError = errorMessage;
  }

  return validationError;
};

const TextInput = ({
  initialValue,
  label,
  placeholder,
  onChange,
  inputMode,
  required = false,
  regex = null,
  errorMessage = "Invalid input",
  disabled = false,
  secureTextEntry = false,
}) => {
  const [value, setValue] = useState(initialValue ?? "");
  const [error, setError] = useState("");

  // Handle text change
  const handleChange = (text) => {
    if (onChange) onChange(text);
    setValue(text);
    setError(validateInput(text, regex, required, label, errorMessage));
  };

  return (
    <Input
      inputMode={inputMode}
      label={label}
      labelStyle={styles.label}
      value={value}
      onChangeText={handleChange}
      errorMessage={error}
      placeholder={placeholder}
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
      disabled={disabled}
      secureTextEntry={secureTextEntry}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    height: 82
  },
  inputContainer: {
    borderBottomWidth: 0,
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "200",
    marginBottom: 4,
    marginHorizontal: 8,
  },
});

export default TextInput;
