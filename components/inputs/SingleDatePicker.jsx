import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import DatePicker from "../datepicker";
import { Button, Text } from "@rneui/themed";

export default function SingleDatePicker({
  label,
  value,
  placeholder,
  onDateSelected,
  iconRight = false,
  icon,
}) {
  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false);
  const [date, setDate] = useState(value ?? "");

  const openDatePickerSingle = () => setShowDatePickerSingle(true);
  const onCancelSingle = () => {
    // You should close the modal in here
    setShowDatePickerSingle(false);
  };
  const onConfirmSingle = (output) => {
    const date = output.dateString;
    // You should close the modal in here
    setShowDatePickerSingle(false);
    setDate(date);
    onDateSelected(date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Button
        iconRight={iconRight}
        titleStyle={[styles.placeholder, date && styles.title]}
        title={date ? date : placeholder}
        buttonStyle={styles.button}
        onPress={openDatePickerSingle}
        containerStyle={styles.buttonContainer}
        icon={icon ?? null}
      />
      <DatePicker
        isVisible={showDatePickerSingle}
        dateStringFormat="mm/dd/yyyy"
        mode={"single"}
        onCancel={onCancelSingle}
        onConfirm={onConfirmSingle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
  },
  buttonContainer: {
    backgroundColor: "white",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  title: {
    color: "black",
    textAlign: "left",
    width: "100%",
  },
  placeholder: {
    color: "#aaa",
    textAlign: "left",
    width: "100%",
    paddingStart: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "200",
    color: "#aaa",
    paddingHorizontal: 8,
  },
});
