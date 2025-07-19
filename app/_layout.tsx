import { SafeAreaView } from "react-native";
import React, { useEffect } from "react";
import { Stack } from "expo-router";
import "./global.css";
import useAuthStore from "@/stores/useAuthStore";
import { trpc } from "@/utils/trpc";

const RootLayout = () => {
  const { appUser, setAppUser } = useAuthStore();

  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (user) {
      setAppUser(user);
    }
  }, [appUser, setAppUser, isLoading]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack>
        <Stack.Protected guard={!!appUser}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!appUser}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </SafeAreaView>
  );
};

export default RootLayout;
