import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ListMusic, Plus } from "lucide-react-native";

export default function PlaylistsTab() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
      <LinearGradient
        colors={[
          "rgba(236, 72, 153, 0.3)",
          "rgba(139, 92, 246, 0.2)",
          "rgba(0, 0, 0, 0.9)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-center items-center px-6"
      >
        <View className="items-center">
          <LinearGradient
            colors={["#ec4899", "#8b5cf6"]}
            className="w-24 h-24 rounded-3xl items-center justify-center mb-6"
          >
            <ListMusic size={32} color="white" />
          </LinearGradient>

          <Text className="text-white text-3xl font-bold mb-2">Playlists</Text>
          <Text className="text-gray-400 text-center mb-8">
            Create and manage your personal playlists
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/playlists")}
            className="bg-purple-500 flex-row items-center px-8 py-4 rounded-2xl"
          >
            <ListMusic size={20} color="white" />
            <Text className="text-white font-medium ml-2">
              View All Playlists
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}
