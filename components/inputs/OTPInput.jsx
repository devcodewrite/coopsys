import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { Platform, StyleSheet } from "react-native";
import { Text } from "@rneui/themed";

const OTPInput = ({ code, setCode, onSendCode }) => {
  const numCells = 6;
  const codeFieldRef = useBlurOnFulfill({
    value: code,
    cellCount: numCells,
  });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: code,
    setValue: setCode,
  });

  return (
    <CodeField
      ref={codeFieldRef}
      {...props}
      value={code}
      onChangeText={setCode}
      cellCount={numCells}
      keyboardType="number-pad"
      textContentType="oneTimeCode"
      onBlur={onSendCode}
      autoComplete={Platform.select({
        android: "sms-otp",
        default: "one-time-code",
      })}
      rootStyle={styles.container}
      renderCell={({ index, symbol, isFocused }) => (
        <Text
          key={index}
          style={[styles.cell, isFocused && styles.focusCell]}
          onLayout={getCellOnLayoutHandler(index)}
        >
          {symbol || (isFocused ? <Cursor /> : null)}
        </Text>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { gap: 8, marginTop: 32 },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: 100,
    marginHorizontal: 16,
  },
  cell: {
    width: 50,
    height: 50,
    alignSelf: "center",
    fontSize: 36,
    borderWidth: 2,
    textAlign: "center",
    borderColor: "#0e0ef0",
    shadowColor: "#444",
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 6,
    borderRadius: 15,
  },
  focusCell: {
    borderColor: "#0e0ef0",
  },
});

export default OTPInput;
