import SettingOption from "@/components/SettingOption";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import ProfileHeader from "@/components/ProfileHeader";
import { useAuth } from "@/coopsys/auth/AuthProvider";
import api from "@/coopsys/apis/api";
import { createSyncManager } from "../../coopsys/db/syncManager";
import { OrganizationModel } from "../../coopsys/models/organizationModel";
import { useEffect, useRef, useState } from "react";
import settingModel from "../../coopsys/models/settingModel";
import {
  navigateForResult,
  useActivityResult,
} from "@/hooks/useNavigateForResult";
import { useRouter } from "expo-router";

const coopBaseUrl = process.env.EXPO_PUBLIC_COOP_URL;
const organizationModel = new OrganizationModel();

export default function SettingScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const syncManager = useRef(null);
  const { setCallback2 } = useActivityResult();
  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    createSyncManager("", {
      organizations: organizationModel,
    })
      .then((manager) => {
        syncManager.current = manager;
      })
      .catch((err) => console.log(err));
    getOrganization();
  }, []);

  const getOrganization = async () => {
    try {
      const result = await settingModel.getSetting("organization");
      if (result) {
        const data = JSON.parse(result);
        setOrganization(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Handler functions for each option
  const handlePersonalInfoPress = () =>
    Alert.alert("Personal Info", "Navigate to Personal Info screen");
  const handleSignInSecurityPress = () =>
    Alert.alert("Sign In & Security", "Navigate to Sign In & Security screen");
  const handleSubscriptionPress = () =>
    Alert.alert("Subscription", "Navigate to Subscription screen");

  const handleOrganizationPress = async () => {
    const result = await navigateForResult(
      setCallback2,
      router,
      "menus/screens/organizations",
      {
        selected: [organization.orgid],
      }
    );
    if (result.length > 0) {
      setOrganization(result[0]);
      await settingModel.setSetting("organization", JSON.stringify(result[0]));
    }
  };

  const handleDeleteAccountPress = () =>
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?"
    );
  const handleTermsOfUsePress = () =>
    Alert.alert("Terms of Use", "Open Terms of Use");
  const handlePrivacyPolicyPress = () =>
    Alert.alert("Privacy Policy", "Open Privacy Policy");
  const handleLogoutPress = () =>
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Yes,Logout", style: "destructive", onPress: logout },
      { text: "Cancel", style: "cancel" },
    ]);

  if (!user) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <ProfileHeader
        name={user.name}
        email={user.email}
        avatarUrl={user.photo}
      />

      {/* Settings Options */}
      <SettingOption
        title="Personal Info"
        icon="person"
        onPress={handlePersonalInfoPress}
      />
      <SettingOption
        title="Sign In & Security"
        icon="lock"
        onPress={handleSignInSecurityPress}
      />
      <SettingOption
        title="Subscription"
        icon="credit-card"
        onPress={handleSubscriptionPress}
      />
      <SettingOption
        title="Organization"
        icon="business"
        value={organization?.name}
        onPress={handleOrganizationPress}
      />

      {/* Divider for separating account management */}
      <View style={styles.divider} />

      <SettingOption
        title="Delete Account"
        icon="delete"
        onPress={handleDeleteAccountPress}
      />
      <SettingOption
        title="Terms of Use"
        icon="description"
        onPress={handleTermsOfUsePress}
      />
      <SettingOption
        title="Privacy Policy"
        icon="policy"
        onPress={handlePrivacyPolicyPress}
      />
      <SettingOption title="Logout" icon="logout" onPress={handleLogoutPress} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
  },
  divider: {
    marginVertical: 16,
  },
});
