import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AudioPlayerWrapper } from "@/components";
import { useAudioStore } from "@/stores/useAudioStore";

const TabLayout = () => {
  const { currentSong } = useAudioStore();

  return (
    <SafeAreaProvider>
      <View className="flex-1" style={{ paddingBottom: currentSong ? 140 : 0 }}>
        <Tabs
          screenOptions={{
            tabBarStyle: {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#171717", // neutral-900
              borderTopColor: "#404040",
              borderTopWidth: 1,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: () => <Text>🏠</Text>,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              headerShown: false,
              tabBarIcon: () => <Text>👤</Text>,
            }}
          />
          <Tabs.Screen
            name="library"
            options={{
              title: "Library",
              headerShown: false,
              tabBarIcon: () => <Text>📚</Text>,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: "Settings",
              headerShown: false,
              tabBarIcon: () => <Text>⚙️</Text>,
            }}
          />
        </Tabs>
      </View>
      <AudioPlayerWrapper />
    </SafeAreaProvider>
  );
};

export default TabLayout;
