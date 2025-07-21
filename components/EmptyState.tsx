import { Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";

interface EmptyStateProps {
  hasQuery: boolean;
}

export default function EmptyState({ hasQuery }: EmptyStateProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(300)}
      className="flex-1 justify-center items-center py-20"
    >
      <LinearGradient
        colors={["rgba(236, 72, 153, 0.1)", "rgba(139, 92, 246, 0.1)"]}
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
      >
        <Text className="text-6xl">🎵</Text>
      </LinearGradient>
      <Text className="text-gray-400 text-lg text-center font-medium">
        {hasQuery ? "No songs found" : "No songs available"}
      </Text>
      <Text className="text-gray-500 text-sm text-center mt-2">
        {hasQuery
          ? "Try a different search term"
          : "Upload some music to get started"}
      </Text>
    </Animated.View>
  );
}
