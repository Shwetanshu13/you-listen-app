// app/(tabs)/index.tsx
import { View, Text, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SongList from "@/components/SongList";

export default function HomePage() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      className="flex-1 bg-black"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 100, // room for audio player
        paddingTop: 24,
      }}
    >
      <Text className="text-white text-2xl font-bold px-6 pb-4">All Songs</Text>

      <View className="px-4">
        <SongList />
      </View>
    </ScrollView>
  );
}
