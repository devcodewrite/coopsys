import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import DatePicker from "../datepicker";
import { Button, Text } from "@rneui/themed";
import { Ionicons } from "@expo/vector-icons";

export default function RangeDatePicker({
  label,
  placeholder,
  value,
  onDateSelected = (startDate, endDate) => {},
}) {
  const [showDatePickerRange, setShowDatePickerRange] = useState(false);
  const [date, setDate] = useState(`${value?.startDate} - ${value?.endDate}`);

  const openDatePickerRange = () => setShowDatePickerRange(true);
  const onCancelRange = () => {
    // You should close the modal in here
    setShowDatePickerRange(false);
  };
  const onConfirmRange = (output) => {
    const { startDateString, endDateString } = output;
    const date = `${startDateString} - ${endDateString}`;
    // You should close the modal in here
    setShowDatePickerRange(false);
    setDate(date);
    onDateSelected(startDateString, endDateString);
  };

  const handleClear = () => {
    setDate("");
    onDateSelected("", "");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Button
        titleStyle={[styles.placeholder, date && styles.title]}
        title={date ? date : placeholder}
        buttonStyle={styles.button}
        onPress={openDatePickerRange}
        icon={
          date ? (
            <Ionicons onPress={handleClear} name="close" size={24} />
          ) : null
        }
        iconRight
      />
      <DatePicker
        isVisible={showDatePickerRange}
        dateStringFormat="mm/dd/yyyy"
        mode={"range"}
        onCancel={onCancelRange}
        onConfirm={onConfirmRange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  button: {
    backgroundColor: "white",
    height: 50,
    marginBottom: 8,
    paddingHorizontal: 16,
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
  },
  label: {
    fontSize: 16,
    fontWeight: "200",
    paddingHorizontal: 8,
    color: "#aaa",
  },
});
