import React, { useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text } from "@rneui/themed";
import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Asset } from "expo-asset";

import TextInput from "@/components/inputs/TextInput";
import { useAuth } from "@/coopsys/auth/AuthProvider";
import api from "@/coopsys/apis/api";

const baseUrl = process.env.EXPO_PUBLIC_ACCOUNTS_URL;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = () => {
    setLoading(true);

    const data = {
      email,
      password,
    };
    api
      .post(`${baseUrl}/auth/authorize`, data)
      .then(
        (result) => {
          const { data } = result;
          if (data.status) {
            login(data.access_token, data.refresh_token, data.data);
          }
        },
        ({ response }) => {
          const { data } = response;
          if (data.code === 12) {
            Alert.alert(
              data.message,
              "Email verification is required to login",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Verify, Email",
                  style: "default",
                  onPress: handleVerify,
                },
              ]
            );
          } else {
            Alert.alert(data.message);
          }
          console.log("Request Rejected:", data);
        }
      )
      .catch((error) => {
        if (error.code === "ECONNABORTED") {
          console.log("Request timeout error:", error.message);
        } else {
          console.log("An error occurred:", error.message);
          Alert.alert("Network Error", "Network connection failed!");
        }
      })
      .finally(() => setLoading(false));
  };

  const handleVerify = async () => {
    setLoading(true);
    const data = {
      identifier: email,
      type: "email_verification",
      callbackUrl: `${baseUrl}/verify`,
    };
    api
      .post(`${baseUrl}/auth/request-otp`, data)
      .then(
        (result) => {
          const { data } = result;
          if (data.status) {
            Alert.alert(
              "Email Sent!",
              `We've sent you a verification link to your email: ${email}`
            );
          }
          console.log("result", data);
        },
        ({ response }) => {
          const { data } = response;
          console.log("Request Rejected:", data);
        }
      )
      .catch((error) => {
        if (error.code === "ECONNABORTED") {
          console.log("Request timeout error:", error.message);
        } else {
          console.log("An error occurred:", error.message);
        }
        Alert.alert("Network Error", "Network connection failed!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.icon}
          source={{
            uri: Asset.fromModule(require("../../assets/images/login.png")).uri,
          }}
        />
        <Text style={styles.headerTitle}>SignIn</Text>
      </View>
      <View style={styles.content}>
        <TextInput
          label="Email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={setEmail}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          required
          onChange={setPassword}
          secureTextEntry
        />

        <Button
          buttonStyle={styles.button}
          color={"primary"}
          title="Login"
          onPress={handleLogin}
          icon={loading ? <ActivityIndicator color="white" animating /> : null}
          disabled={loading}
          iconRight
        />
        <Button
          buttonStyle={styles.button}
          color={"secondary"}
          type="clear"
          title="Forgot Password?"
          onPress={() => router.push("/auth/forgot-password")}
        />
      </View>
    </View>
  );
};

export default LoginScreen;

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
