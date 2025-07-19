import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const TabLayout = () => {
  return (
    <View>
      <Tabs>
        <Tabs.Screen name="index" options={{ title: "Home" }} />
        <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        <Tabs.Screen name="library" options={{ title: "Library" }} />
      </Tabs>
    </View>
  );
};

export default TabLayout;
