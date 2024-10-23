// components/inputs/ButtonGroupInput.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ButtonGroup } from '@rneui/themed';

const ButtonGroupInput = ({ label, value, onChange, options }) => {
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <ButtonGroup
        buttons={options.map((option) => option.label)}
        selectedIndex={selectedIndex}
        onPress={(index) => onChange(options[index].value)}
        containerStyle={styles.buttonGroup}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonGroup: {
    borderRadius: 5,
  },
});

export default ButtonGroupInput;
