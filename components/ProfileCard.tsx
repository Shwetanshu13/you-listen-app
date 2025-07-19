// components/ProfileCard.tsx (React Native)
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { trpc } from "@/utils/trpc"; // Adapt this to your mobile setup
import useAuthStore from "@/stores/useAuthStore";

export default function ProfileCard() {
  const router = useRouter();
  const { appUser, clearAppUser } = useAuthStore();

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      clearAppUser();
      Toast.show({ type: "success", text1: "Logged out successfully" });
      router.replace("/");
    } catch {
      Toast.show({ type: "error", text1: "Logout failed" });
    }
  };

  return (
    <View className="bg-neutral-800 p-6 rounded-2xl mx-4 mt-8 space-y-4 shadow-lg">
      <Text className="text-2xl font-bold text-white">👤 Profile</Text>

      <View className="space-y-1">
        <Text className="text-white text-sm">
          <Text className="font-semibold">Username:</Text> {appUser?.username}
        </Text>
        <Text className="text-white text-sm">
          <Text className="font-semibold">Role:</Text> {appUser?.role}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-pink-600 rounded-lg py-2 px-4 mt-4"
      >
        <Text className="text-white text-center font-medium">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
