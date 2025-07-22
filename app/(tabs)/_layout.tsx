import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Home, User, Library, Music, ListMusic } from "lucide-react-native";
import { AudioPlayerWrapper } from "@/components";

const TabLayout = () => {
  return (
    <SafeAreaProvider>
      <View className="flex-1">
        <Tabs
          screenOptions={{
            tabBarStyle: {
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#171717", // neutral-900
              borderTopColor: "#ec4899", // pink border
              borderTopWidth: 1,
              paddingBottom: 8,
              paddingTop: 8,
              height: 80,
            },
            tabBarActiveTintColor: "#ec4899", // pink for active tab
            tabBarInactiveTintColor: "#6b7280", // gray for inactive tabs
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
              headerShown: false,
              tabBarIcon: ({ color }) => <Home size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="library"
            options={{
              title: "Library",
              headerShown: false,
              tabBarIcon: ({ color }) => <Library size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="playlists"
            options={{
              title: "Playlists",
              headerShown: false,
              tabBarIcon: ({ color }) => <ListMusic size={24} color={color} />,
            }}
          />
          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              headerShown: false,
              tabBarIcon: ({ color }) => <User size={24} color={color} />,
            }}
          />
        </Tabs>
      </View>
      <AudioPlayerWrapper />
    </SafeAreaProvider>
  );
};

export default TabLayout;
