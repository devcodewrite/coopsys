import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import TextInput from "@/components/inputs/TextInput";
import { Button, Text } from "@rneui/themed";
import { Asset } from "expo-asset";
import { Image } from "expo-image";

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    // Add your signup logic here
    console.log("Signup pressed");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.icon}
          source={{
            uri: Asset.fromModule(
              require("../../assets/images/mobile-password-forgot.png")
            ).uri,
          }}
        />
        <Text style={styles.headerTitle}>SignIn</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.footer}>
        <Button title="Sign Up" onPress={handleSignup} />
      </View>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    marginTop: 60,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "600",
  },
  content: {
    rowGap: 16,
    marginTop: 16,
  },
  icon: {
    height: 150,
    width: 150,
  },
  footer: {
    flex: 1,
    rowGap: 16,
    marginTop: 24,
    alignItems: "center",
  },
  button: {
    height: 45,
    width: 300,
  },
});
