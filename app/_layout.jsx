import { Slot, useRouter } from "expo-router";
import React, { useEffect } from "react";

import { AuthProvider, useAuth } from "@/coopsys/auth/AuthProvider";
import { CallbackProvider } from "@/hooks/useNavigateForResult";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <CallbackProvider>
        <AppLayout>
          <Slot />
        </AppLayout>
      </CallbackProvider>
    </AuthProvider>
  );
}

const AppLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("auth/login"); // Redirect to login if not logged in
    } else {
      router.push("/"); // Redirect to home if logged in
    }
  }, [user]);

  return <>{children}</>; // Render children if logged in
};
