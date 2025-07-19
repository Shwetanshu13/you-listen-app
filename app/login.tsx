// app/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import useAuthStore from "@/stores/useAuthStore";

const LoginPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { setAppUser } = useAuthStore();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/auth/login`,
        { username, password },
        { withCredentials: true }
      );

      const user = res.data;
      if (!user) {
        throw new Error("Invalid username or password");
      }
      // Store user data in Zustand or AsyncStorage as needed
      setAppUser({
        id: user.id,
        username: user.username,
        role: user.role,
      });
      router.replace("/"); // Replace login screen
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-neutral-900 items-center justify-center px-4">
      <View className="bg-neutral-800 p-6 rounded w-full max-w-sm space-y-4">
        <Text className="text-2xl font-semibold text-white text-center">
          Login
        </Text>

        <View>
          <Text className="text-sm text-white mb-1">Username</Text>
          <TextInput
            className="w-full px-3 py-2 rounded bg-neutral-700 text-white"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            placeholderTextColor="#aaa"
          />
        </View>

        <View>
          <Text className="text-sm text-white mb-1">Password</Text>
          <TextInput
            className="w-full px-3 py-2 rounded bg-neutral-700 text-white"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
          />
        </View>

        {error !== "" && (
          <Text className="text-red-500 text-sm text-center">{error}</Text>
        )}

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isLoading}
          className="w-full py-2 rounded bg-pink-600 active:bg-pink-700"
        >
          <Text className="text-white text-center">
            {isLoading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginPage;
