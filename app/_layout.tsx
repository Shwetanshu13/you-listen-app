import { SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import "./global.css";
import useAuthStore from "@/stores/useAuthStore";
import axiosInstance from "@/utils/axios";
import { Providers } from "@/components";

export default function RootLayout() {
  const { appUser, setAppUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get("/auth/me");
        setAppUser(response.data);
      } catch (error) {
        // User not logged in or unauthorized
        console.log("User not authenticated:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return null; // Or render a loading spinner

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Providers>
        <Stack>
          <Stack.Protected guard={!!appUser}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={!appUser}>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
      </Providers>
    </SafeAreaView>
  );
}
