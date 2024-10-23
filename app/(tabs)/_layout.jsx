import { Tabs, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { View } from "react-native";
import CustomAvatar from "@/components/CustomAvatar";
import api from "@/coopsys/apis/api";
import { useAuth } from "@/coopsys/auth/AuthProvider";
import { createSyncManager } from "../../coopsys/db/syncManager";
import { OrganizationModel } from "../../coopsys/models/organizationModel";
import settingModel from "../../coopsys/models/settingModel";

const coopBaseUrl = process.env.EXPO_PUBLIC_COOP_URL;
const organizationModel = new OrganizationModel();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const syncManager = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    createSyncManager("", {
      organizations: organizationModel,
    })
      .then((manager) => {
        syncManager.current = manager;
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (user) fetchOrganizations(user);
  }, [user]);

  const fetchOrganizations = (user) => {
    api
      .get(`${coopBaseUrl}/organizations?filters[owner]=${user.owner}`)
      .then(
        async (result) => {
          const { data } = result;
          if (data.status) {
            await organizationModel.saveChanges(data.data);
            const org = await settingModel.getSetting("organization");
            if (!org && data.data.length > 0)
              await settingModel.setSetting(
                "organization",
                JSON.stringify(data.data[0])
              );
          }
        },
        ({ response }) => {
          const { data } = response;
          Alert.alert(data.message);
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
      });
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
      screenListeners={{
        tabPress: (e) => {
          if (e.target?.split("-")[0] === "add") {
            e.preventDefault();
            router.push("plus/add");
          }
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "CoopSYS",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: "28",
          },
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
          headerRight: () => (
            <CustomAvatar
              size={32}
              rounded
              source={{
                uri: "https://randomuser.me/api/portraits/women/44.jpg",
              }}
            />
          ),
          headerRightContainerStyle: { paddingRight: 16 },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "search-circle" : "search-circle-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "New Record",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "add-circle" : "add-circle-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="local_sync"
        options={{
          title: "Local Sync",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "sync-circle" : "sync-circle-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitleAlign: "left",
          headerTitleStyle: { fontSize: 32, fontWeight: "bold" },
          headerBackground: ({}) => <View />,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "settings" : "settings-outline"}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
