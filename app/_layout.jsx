import { Slot, Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

import { AuthProvider, useAuth } from "@/coopsys/auth/AuthProvider";
import { CallbackProvider } from "@/hooks/useNavigateForResult";
import { ThemeProvider } from "@rneui/themed";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CallbackProvider>
          <AppLayout>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="menus/filter"
                options={{ headerShown: true }}
              />
                <Stack.Screen
                name="menus/screens/actypes"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="menus/screens/associations"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="menus/screens/communities"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="menus/screens/districts"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="menus/screens/offices"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="menus/screens/regions"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="menus/screens/passbooks"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="menus/screens/accounts"
                options={{ headerShown: true }}
              />
               <Stack.Screen
                name="menus/screens/organizations"
                options={{ headerShown: true }}
              />
              <Stack.Screen name="plus/add" options={{ headerShown: true }} />
              <Stack.Screen
                name="communities/edit"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="communities/list"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="communities/details"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="offices/edit"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="offices/list"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="offices/details"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="associations/edit"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="associations/list"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="associations/details"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="passbooks/edit"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="passbooks/list"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="passbooks/details"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="accounts/edit"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="accounts/list"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="accounts/details"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="withdrawals/edit"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="withdrawals/list"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="collections/add_deposits"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="collections/edit"
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="collections/list"
                options={{ headerShown: true }}
              />
            </Stack>
          </AppLayout>
        </CallbackProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

const AppLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("auth/login"); // Redirect to login if not logged in
      } else {
        router.push("/"); // Redirect to home if logged in
      }
    }
    if (!loading) SplashScreen.hideAsync();
  }, [user, loading]);

  return <>{children}</>; // Render children if logged in
};
