import { SafeAreaView } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <SafeAreaView>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
      </Stack>
    </SafeAreaView>
  );
};

export default RootLayout;
