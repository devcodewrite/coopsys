import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import TextInput from "@/components/inputs/TextInput";
import { Button, Text, useTheme } from "@rneui/themed";
import { Image } from "expo-image";
import { Asset } from "expo-asset";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const { theme } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = () => {
    setLoading(true);
    // Add your forgot password logic here
    console.log("Forgot password pressed");
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
        <Text style={styles.headerTitle}>Forgot Password ?</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
          required
        />
        <Button
          buttonStyle={styles.button}
          title="Submit"
          onPress={handleForgotPassword}
          icon={loading ? <ActivityIndicator color="white" animating /> : null}
          disabled={loading}
        />

        <Button
          buttonStyle={styles.button}
          type="clear"
          title="Login instead"
          icon={<Ionicons color={theme.colors.primary} name="arrow-back-outline" size={16} />}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;

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
    alignItems: "center",
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
    borderRadius: 8,
  },
});
