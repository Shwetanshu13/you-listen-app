// app/(tabs)/library.tsx

import { View, Text } from "react-native";

export default function LibraryPage() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-900 px-6">
      <Text className="text-white text-2xl font-bold">Library</Text>
      <Text className="text-neutral-400 mt-2">
        This page is under construction.
      </Text>
      <Text className="text-neutral-500 mt-1">Stay tuned for updates!</Text>
      <Text className="text-neutral-600 text-center mt-4">Coming soon...</Text>
    </View>
  );
}
