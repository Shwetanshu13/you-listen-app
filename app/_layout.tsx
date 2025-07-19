import { SafeAreaView } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import "./global.css";

const RootLayout = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Home", headerShown: false }}
        />
      </Stack>
    </SafeAreaView>
  );
};

export default RootLayout;
