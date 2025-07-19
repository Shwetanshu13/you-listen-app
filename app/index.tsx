// app/index.tsx

import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LandingPage() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-black px-6">
      <View>
        <Text className="text-white text-4xl font-semibold text-center">
          Welcome to
        </Text>
        <Text className="text-white text-4xl font-extrabold text-center">
          You Listen
        </Text>
        <Text className="text-white text-lg my-2 text-center">
          Private music streaming for your circle only.
        </Text>
        <TouchableOpacity className="mt-6 bg-pink-500 px-4 py-2 rounded-full">
          <Link href="/login" asChild>
            <Text className="text-white text-center text-lg font-semibold my-3">
              Get Started
            </Text>
          </Link>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
