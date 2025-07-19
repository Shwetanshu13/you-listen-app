// app/index.tsx

import { Link } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LandingPage() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-black px-6 m-6">
      <View>
        <Text className="text-white text-4xl font-bold text-center">
          Welcome to You Listen
        </Text>
        <Text className="text-white text-lg mt-2 text-center">
          Private music streaming for your circle only.
        </Text>
        <Link href="/login" asChild>
          <TouchableOpacity>
            <Text className="mt-6 text-pink-500 text-lg font-semibold">
              Get Started
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}
