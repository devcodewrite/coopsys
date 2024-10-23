import { Ionicons } from "@expo/vector-icons";
import { Button, Input, Text } from "@rneui/themed";
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";

const NumberInput = ({
  minValue = 0,
  maxValue = 100,
  step = 1,
  initialValue = 0,
  onValueChange,
  label,
  style
}) => {
  const [value, setValue] = useState(initialValue);

  // Handler for increment
  const handleIncrement = () => {
    if (value + step <= maxValue) {
      const newValue = value + step;
      setValue(newValue);
      onValueChange && onValueChange(newValue);
    }
  };

  // Handler for decrement
  const handleDecrement = () => {
    if (value - step >= minValue) {
      const newValue = value - step;
      setValue(newValue);
      onValueChange && onValueChange(newValue);
    }
  };

  return (
    <View style={style}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.container}>
        <Button
          buttonStyle={styles.button}
          onPress={handleDecrement}
          icon={() => <Ionicons color={"white"} name="remove" size={24} />}
        />
        <Input
          inputStyle={styles.input}
          containerStyle={styles.inputContainer}
          inputMode="numeric"
          value={String(value)}
          editable={false}
        />
        <Button
          buttonStyle={styles.button}
          onPress={handleIncrement}
          icon={() => <Ionicons color={"white"} name="add" size={24} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    height: 50,
    width: 50,
  },
  input: {
    textAlign: "center",
    height: 50,
  },
  inputContainer: {
    borderWidth: 0,
    height: 50,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "200",
    color: "#aaa",
    paddingHorizontal: 8,
  },
});

export default NumberInput;
