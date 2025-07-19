import { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAudioCache } from "@/hooks/useAudioCache";

export default function Settings() {
  const { getCacheSize, clearCache } = useAudioCache();
  const [cacheSize, setCacheSize] = useState(0);

  useEffect(() => {
    const updateCacheSize = async () => {
      const size = await getCacheSize();
      setCacheSize(size);
    };

    updateCacheSize();
  }, [getCacheSize]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear all cached songs? This will remove all downloaded songs and they will need to be downloaded again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await clearCache();
            setCacheSize(0);
            Alert.alert("Success", "Cache cleared successfully!");
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="p-4">
        <Text className="text-white text-2xl font-bold mb-6">Settings</Text>

        {/* Audio Cache Section */}
        <View className="bg-neutral-900 rounded-xl p-4 mb-4">
          <Text className="text-white text-lg font-semibold mb-4">
            Audio Cache
          </Text>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-300">Cache Size</Text>
            <Text className="text-white">{formatBytes(cacheSize)}</Text>
          </View>

          <Pressable
            onPress={handleClearCache}
            className="bg-red-600 p-3 rounded-lg"
          >
            <Text className="text-white text-center font-medium">
              Clear Cache
            </Text>
          </Pressable>

          <Text className="text-gray-400 text-sm mt-2">
            Cached songs can be played without internet connection and have
            better performance.
          </Text>
        </View>

        {/* Audio Settings */}
        <View className="bg-neutral-900 rounded-xl p-4 mb-4">
          <Text className="text-white text-lg font-semibold mb-4">
            Audio Settings
          </Text>

          <View className="mb-3">
            <Text className="text-gray-300 mb-2">Background Playback</Text>
            <Text className="text-green-400 text-sm">✓ Enabled</Text>
            <Text className="text-gray-400 text-xs mt-1">
              Music will continue playing when the app is in the background.
            </Text>
          </View>

          <View className="mb-3">
            <Text className="text-gray-300 mb-2">Auto-Cache</Text>
            <Text className="text-green-400 text-sm">✓ Enabled</Text>
            <Text className="text-gray-400 text-xs mt-1">
              Songs will be automatically cached for better performance.
            </Text>
          </View>
        </View>

        {/* About */}
        <View className="bg-neutral-900 rounded-xl p-4">
          <Text className="text-white text-lg font-semibold mb-4">About</Text>

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-300">App Version</Text>
            <Text className="text-white">1.0.0</Text>
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-gray-300">Audio Engine</Text>
            <Text className="text-white">Expo AV</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
