import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Dimensions,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import {
  ChevronDown,
  Heart,
  Share2,
  MoreHorizontal,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  List,
} from "lucide-react-native";
import Slider from "@react-native-community/slider";
import { useAudioStore } from "@/stores/useAudioStore";
import useLibraryStore from "@/stores/useLibraryStore";
import useAuthStore from "@/stores/useAuthStore";
import axiosInstance from "@/utils/axios";

interface SongDetails {
  id: number;
  title: string;
  artist: string;
  duration: string;
}

export default function AudioPage() {
  const router = useRouter();
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    currentTime,
    duration,
    progress,
    seekTo,
    isLoading,
    // Queue and control functionality
    queue,
    currentIndex,
    repeatMode,
    shuffleMode,
    playNext,
    playPrevious,
    setRepeatMode,
    toggleShuffle,
    hasNext,
    hasPrevious,
  } = useAudioStore();

  const { toggleLike, isLiked } = useLibraryStore();
  const { appUser } = useAuthStore();
  const [songDetails, setSongDetails] = useState<SongDetails | null>(null);
  const [isSeeking, setIsSeeking] = useState(false);
  const seekTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check authentication
  useEffect(() => {
    if (!appUser) {
      router.replace("/login");
      return;
    }
  }, [appUser, router]);

  // Animation values
  const pulseAnimation = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    // Pulse animation for play button
    pulseAnimation.value = withRepeat(
      withTiming(1.1, { duration: 1000 }),
      -1,
      true
    );

    // Rotation animation for album art
    if (isPlaying) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 20000 }),
        -1,
        false
      );
    }
  }, [isPlaying]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: isPlaying ? pulseAnimation.value : 1 }],
  }));

  const rotationStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Fetch song details when currentSong changes
  useEffect(() => {
    const fetchSongDetails = async () => {
      if (!currentSong) return;

      try {
        // You can provide this API endpoint
        const response = await axiosInstance.get(
          `/songs/${currentSong.id}/getDetail`
        );
        // console.log("Fetched song details:", response.data);
        const { id, title, artist, duration } = response.data;
        setSongDetails({
          id,
          title,
          artist,
          duration: duration || "0:00",
        });
      } catch (error) {
        console.error("Failed to fetch song details:", error);
        // Fallback to current song data
        setSongDetails({
          id: currentSong.id,
          title: currentSong.title,
          artist: currentSong.artist,
          duration: currentSong.duration || "0:00",
        });
      }
    };

    fetchSongDetails();
  }, [currentSong]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (seekTimeoutRef.current) {
        clearTimeout(seekTimeoutRef.current);
      }
    };
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleSeek = (value: number) => {
    // This is called during dragging - we don't seek here to avoid conflicts
    // Actual seeking happens in onSlidingComplete
  };

  // Don't render if not authenticated or no song
  if (!appUser || !currentSong || !songDetails) return null;

  return (
    <Animated.View
      entering={SlideInUp.duration(300)}
      exiting={SlideOutDown.duration(200)}
      className="flex-1"
    >
      <SafeAreaView className="flex-1 bg-black">
        <ImageBackground
          source={{
            uri: "https://via.placeholder.com/400x400/1f1f1f/ffffff?text=♪",
          }}
          className="flex-1"
          blurRadius={20}
        >
          <LinearGradient
            colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)", "rgba(0,0,0,0.95)"]}
            className="flex-1"
          >
            {/* Modal Handle */}
            <View className="items-center py-2">
              <View className="w-12 h-1 bg-white/30 rounded-full" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
              {/* Header */}
              <Animated.View
                entering={FadeInDown.delay(100)}
                className="flex-row justify-between items-center px-6 py-4"
              >
                <Pressable
                  onPress={() => router.dismiss()}
                  className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-xl items-center justify-center"
                >
                  <ChevronDown size={24} color="white" />
                </Pressable>

                <View className="flex-1 items-center">
                  <Text className="text-white/80 text-sm font-medium">
                    PLAYING
                  </Text>
                  <Text className="text-white text-sm">
                    {songDetails.title} by {songDetails.artist}
                  </Text>
                </View>

                <Pressable className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-xl items-center justify-center">
                  <MoreHorizontal size={24} color="white" />
                </Pressable>
              </Animated.View>

              {/* Album Art */}
              <Animated.View
                entering={FadeInUp.delay(200)}
                className="items-center px-8 py-8"
              >
                <Animated.View className="w-80 h-80 rounded-full shadow-2xl">
                  <View className="w-full h-full rounded-full p-1 bg-black">
                    <View className="flex-1 rounded-full bg-neutral-800 items-center justify-center overflow-hidden">
                      <Text className="text-6xl">🎵</Text>
                    </View>
                  </View>
                </Animated.View>
              </Animated.View>

              {/* Song Info */}
              <Animated.View
                entering={SlideInDown.delay(300)}
                className="px-8 py-4"
              >
                <Text className="text-white text-3xl font-bold text-center mb-2">
                  {songDetails.title}
                </Text>
                <Text className="text-white/70 text-xl text-center mb-4">
                  {songDetails.artist}
                </Text>
              </Animated.View>

              {/* Action Buttons */}
              <Animated.View
                entering={FadeInUp.delay(350)}
                className="flex-row justify-center items-center px-8 py-4 space-x-6"
              >
                {/* Like Button */}
                <Pressable
                  onPress={() => {
                    console.log("Like feature coming soon!");
                    // Temporarily disabled to avoid 404 errors
                    // if (currentSong) {
                    //   try {
                    //     toggleLike(currentSong.id);
                    //   } catch (error) {
                    //     console.log("Like feature not available yet");
                    //   }
                    // }
                  }}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl items-center justify-center"
                >
                  <Heart size={20} color="white" fill="transparent" />
                </Pressable>

                {/* Shuffle Button */}
                <Pressable
                  onPress={toggleShuffle}
                  className={`w-12 h-12 rounded-full backdrop-blur-xl items-center justify-center ${
                    shuffleMode ? "bg-purple-500/30" : "bg-white/10"
                  }`}
                >
                  <Shuffle
                    size={20}
                    color={shuffleMode ? "#a855f7" : "white"}
                  />
                </Pressable>

                {/* Repeat Button */}
                <Pressable
                  onPress={() => {
                    const nextMode =
                      repeatMode === "off"
                        ? "all"
                        : repeatMode === "all"
                        ? "one"
                        : "off";
                    setRepeatMode(nextMode);
                  }}
                  className={`w-12 h-12 rounded-full backdrop-blur-xl items-center justify-center ${
                    repeatMode !== "off" ? "bg-green-500/30" : "bg-white/10"
                  }`}
                >
                  {repeatMode === "one" ? (
                    <Repeat1 size={20} color="#10b981" />
                  ) : (
                    <Repeat
                      size={20}
                      color={repeatMode === "all" ? "#10b981" : "white"}
                    />
                  )}
                </Pressable>

                {/* Queue Button */}
                <Pressable
                  onPress={() => {
                    // TODO: Open queue modal or navigate to queue page
                    console.log("Queue:", queue.length, "songs");
                  }}
                  className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl items-center justify-center"
                >
                  <List size={20} color="white" />
                  {queue.length > 0 && (
                    <View className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 rounded-full items-center justify-center">
                      <Text className="text-white text-xs font-bold">
                        {queue.length > 99 ? "99+" : queue.length}
                      </Text>
                    </View>
                  )}
                </Pressable>

                {/* Share Button */}
                <Pressable className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl items-center justify-center">
                  <Share2 size={20} color="white" />
                </Pressable>
              </Animated.View>

              {/* Queue Info */}
              {queue.length > 1 && (
                <Animated.View
                  entering={FadeInUp.delay(375)}
                  className="px-8 py-2"
                >
                  <Text className="text-white/60 text-center text-sm">
                    Playing {currentIndex + 1} of {queue.length} •{" "}
                    {hasNext() ? "Next:" : "End of queue"}
                    {hasNext() && queue[currentIndex + 1] && (
                      <Text className="text-white/80">
                        {" "}
                        {queue[currentIndex + 1].title}
                      </Text>
                    )}
                  </Text>
                </Animated.View>
              )}

              {/* Progress Bar */}
              <Animated.View
                entering={FadeInUp.delay(400)}
                className="px-8 py-4"
              >
                <Slider
                  value={isSeeking ? undefined : progress || 0}
                  onValueChange={handleSeek}
                  onSlidingStart={() => setIsSeeking(true)}
                  onSlidingComplete={(value) => {
                    if (!duration || isLoading) {
                      setIsSeeking(false);
                      return;
                    }
                    const newTimeSeconds = (value / 100) * duration;
                    seekTo(newTimeSeconds);
                    setIsSeeking(false);
                  }}
                  disabled={isLoading}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#ec4899"
                  maximumTrackTintColor="rgba(255,255,255,0.2)"
                  thumbTintColor="#ec4899"
                  style={{ height: 40 }}
                />

                <View className="flex-row justify-between mt-2">
                  <Text className="text-white/60 text-sm">
                    {isLoading ? "Loading..." : formatTime(currentTime || 0)}
                  </Text>
                  <Text className="text-white/60 text-sm">
                    {isLoading ? "Loading..." : formatTime(duration || 0)}
                  </Text>
                </View>
              </Animated.View>

              {/* Controls */}
              <Animated.View
                entering={FadeInUp.delay(500)}
                className="flex-row justify-center items-center px-8 py-6 space-x-8"
              >
                {/* Previous Button */}
                <Pressable
                  onPress={playPrevious}
                  disabled={!hasPrevious()}
                  className={`w-16 h-16 rounded-full backdrop-blur-xl items-center justify-center ${
                    hasPrevious() ? "bg-white/20" : "bg-white/10"
                  }`}
                >
                  <SkipBack
                    size={28}
                    color={hasPrevious() ? "white" : "rgba(255,255,255,0.5)"}
                  />
                </Pressable>

                {/* Play/Pause Button */}
                <Animated.View style={pulseStyle}>
                  <Pressable
                    onPress={() => setIsPlaying(!isPlaying)}
                    className="w-20 h-20 rounded-full bg-white items-center justify-center shadow-2xl"
                  >
                    {isLoading ? (
                      <View className="w-8 h-8 rounded-full border-4 border-gray-400 border-t-black animate-spin" />
                    ) : isPlaying ? (
                      <Pause size={32} color="black" />
                    ) : (
                      <View style={{ marginLeft: 4 }}>
                        <Play size={32} color="black" />
                      </View>
                    )}
                  </Pressable>
                </Animated.View>

                {/* Next Button */}
                <Pressable
                  onPress={playNext}
                  disabled={!hasNext()}
                  className={`w-16 h-16 rounded-full backdrop-blur-xl items-center justify-center ${
                    hasNext() ? "bg-white/20" : "bg-white/10"
                  }`}
                >
                  <SkipForward
                    size={28}
                    color={hasNext() ? "white" : "rgba(255,255,255,0.5)"}
                  />
                </Pressable>
              </Animated.View>

              {/* Bottom Spacing */}
              <View className="h-32" />
            </ScrollView>
          </LinearGradient>
        </ImageBackground>
      </SafeAreaView>
    </Animated.View>
  );
}
