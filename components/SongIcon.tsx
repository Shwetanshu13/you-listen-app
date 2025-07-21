import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Music } from "lucide-react-native";

interface SongIconProps {
  isCurrent: boolean;
}

export default function SongIcon({ isCurrent }: SongIconProps) {
  if (isCurrent) {
    return (
      <LinearGradient
        colors={["#ffffff", "#f8fafc"]}
        className="w-12 h-12 rounded-xl items-center justify-center mr-4"
      >
        <Music size={20} color="#1f2937" />
      </LinearGradient>
    );
  }

  return (
    <View className="w-12 h-12 rounded-xl bg-neutral-800 items-center justify-center mr-4">
      <Music size={20} color="#9ca3af" />
    </View>
  );
}
