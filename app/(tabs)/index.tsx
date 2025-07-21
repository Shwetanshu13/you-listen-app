// app/(tabs)/index.tsx
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SongList from "@/components/SongList";

export default function HomePage() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-black" style={{ paddingTop: 24 }}>
      <SongList />
    </View>
  );
}
