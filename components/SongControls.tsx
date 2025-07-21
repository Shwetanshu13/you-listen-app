import { View, Text } from "react-native";
import { Play, Pause } from "lucide-react-native";

interface SongControlsProps {
  duration: string;
  isPlaying: boolean;
  isCurrent: boolean;
}

export default function SongControls({
  duration,
  isPlaying,
  isCurrent,
}: SongControlsProps) {
  return (
    <View className="flex-row items-center">
      <Text
        className={`${
          isCurrent ? "text-white/60" : "text-gray-500"
        } text-xs mr-3`}
      >
        {duration || "0:00"}
      </Text>
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${
          isCurrent ? "bg-white/20" : "bg-neutral-800"
        }`}
      >
        {isCurrent && isPlaying ? (
          <Pause size={16} color="white" />
        ) : (
          <Play
            size={16}
            color={isCurrent ? "white" : "#9ca3af"}
            style={{ marginLeft: 1 }}
          />
        )}
      </View>
    </View>
  );
}
