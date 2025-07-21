import { View, Text } from "react-native";

interface SongInfoProps {
  title: string;
  artist: string;
  isCurrent: boolean;
}

export default function SongInfo({ title, artist, isCurrent }: SongInfoProps) {
  return (
    <View className="flex-1">
      <Text
        className={`${
          isCurrent ? "text-white font-bold" : "text-white font-medium"
        } text-base`}
        numberOfLines={1}
      >
        {title}
      </Text>
      <Text
        className={`${isCurrent ? "text-white/80" : "text-gray-400"} text-sm`}
        numberOfLines={1}
      >
        {artist || "Unknown Artist"}
      </Text>
    </View>
  );
}
