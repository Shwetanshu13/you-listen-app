// components/ProfileCard.tsx (React Native)
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { trpc } from "@/utils/trpc"; // Adapt this to your mobile setup

export default function ProfileCard() {
  const router = useRouter();
  const { data: user, isLoading, error } = trpc.auth.me.useQuery();

  useEffect(() => {
    if (!user && !isLoading) {
      router.replace("/login");
    }
  }, [user, isLoading]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      Toast.show({ type: "success", text1: "Logged out successfully" });
      router.replace("/login");
    } catch {
      Toast.show({ type: "error", text1: "Logout failed" });
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator color="white" />
        <Text className="text-white mt-2">Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="p-4">
        <Text className="text-red-500 text-center">Error loading profile</Text>
      </View>
    );
  }

  if (!user) return null;

  return (
    <View className="bg-neutral-800 p-6 rounded-2xl mx-4 mt-8 space-y-4 shadow-lg">
      <Text className="text-2xl font-bold text-white">👤 Profile</Text>

      <View className="space-y-1">
        <Text className="text-white text-sm">
          <Text className="font-semibold">Username:</Text> {user.username}
        </Text>
        <Text className="text-white text-sm">
          <Text className="font-semibold">Role:</Text> {user.role}
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
