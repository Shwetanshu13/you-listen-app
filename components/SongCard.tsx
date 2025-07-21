import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Pause, Play, Music } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useAudioStore } from "@/stores/useAudioStore";

type SongCardProps = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  fileUrl: string;
};

export default function SongCard({
  id,
  title,
  artist,
  duration,
  fileUrl,
}: SongCardProps) {
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying } =
    useAudioStore();
  const isCurrent = currentSong?.id === id;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePlay = () => {
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });

    if (isCurrent) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong({ id, title, artist, duration, fileUrl });
      setIsPlaying(true);
    }
  };

  return (
    <Animated.View style={animatedStyle} className="mb-3">
      <Pressable onPress={handlePlay}>
        {isCurrent ? (
          <LinearGradient
            colors={["rgba(236, 72, 153, 0.8)", "rgba(139, 92, 246, 0.8)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-1 rounded-2xl"
          >
            <View className="bg-black/20 backdrop-blur-xl rounded-2xl p-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <LinearGradient
                    colors={["#ffffff", "#f8fafc"]}
                    className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  >
                    <Music size={20} color="#1f2937" />
                  </LinearGradient>

                  <View className="flex-1">
                    <Text
                      className="text-white font-bold text-base"
                      numberOfLines={1}
                    >
                      {title}
                    </Text>
                    <Text className="text-white/80 text-sm" numberOfLines={1}>
                      {artist || "Unknown Artist"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center">
                  <Text className="text-white/60 text-xs mr-3">
                    {duration || "0:00"}
                  </Text>
                  <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                    {isPlaying ? (
                      <Pause size={16} color="white" />
                    ) : (
                      <Play size={16} color="white" style={{ marginLeft: 1 }} />
                    )}
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        ) : (
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.02)"]}
            className="rounded-2xl p-4 border border-white/10"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-xl bg-neutral-800 items-center justify-center mr-4">
                  <Music size={20} color="#9ca3af" />
                </View>

                <View className="flex-1">
                  <Text
                    className="text-white font-medium text-base"
                    numberOfLines={1}
                  >
                    {title}
                  </Text>
                  <Text className="text-gray-400 text-sm" numberOfLines={1}>
                    {artist || "Unknown Artist"}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <Text className="text-gray-500 text-xs mr-3">
                  {duration || "0:00"}
                </Text>
                <View className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center">
                  <Play size={16} color="#9ca3af" style={{ marginLeft: 1 }} />
                </View>
              </View>
            </View>
          </LinearGradient>
        )}
      </Pressable>
    </Animated.View>
  );
}
