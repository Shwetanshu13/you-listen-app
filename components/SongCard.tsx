import { View, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useAudioStore } from "@/stores/useAudioStore";
import SongIcon from "./SongIcon";
import SongInfo from "./SongInfo";
import SongControls from "./SongControls";

type SongCardProps = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  fileUrl: string;
  showRemove?: boolean;
  onRemove?: () => void;
};

export default function SongCard({
  id,
  title,
  artist,
  duration,
  fileUrl,
  showRemove,
  onRemove,
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
            className="rounded-2xl overflow-hidden"
          >
            <View className="rounded-2xl p-4 overflow-hidden">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <SongIcon isCurrent={isCurrent} />
                  <SongInfo
                    title={title}
                    artist={artist}
                    isCurrent={isCurrent}
                  />
                </View>
                <SongControls
                  duration={duration}
                  isPlaying={isPlaying}
                  isCurrent={isCurrent}
                  showRemove={showRemove}
                  onRemove={onRemove}
                />
              </View>
            </View>
          </LinearGradient>
        ) : (
          <View className="rounded-2xl overflow-hidden border border-white/10">
            <LinearGradient
              colors={[
                "rgba(255, 255, 255, 0.05)",
                "rgba(255, 255, 255, 0.02)",
              ]}
              className="rounded-2xl p-4"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <SongIcon isCurrent={isCurrent} />
                  <SongInfo
                    title={title}
                    artist={artist}
                    isCurrent={isCurrent}
                  />
                </View>
                <SongControls
                  duration={duration}
                  isPlaying={isPlaying}
                  isCurrent={isCurrent}
                  showRemove={showRemove}
                  onRemove={onRemove}
                />
              </View>
            </LinearGradient>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}
