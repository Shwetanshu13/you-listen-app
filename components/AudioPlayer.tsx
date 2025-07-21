import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, AppState, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Audio, AVPlaybackStatus } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { Pause, Play } from "lucide-react-native";
import { useAudioStore } from "@/stores/useAudioStore";
import { useRouter } from "expo-router";
import Animated, { FadeInUp, SlideInDown } from "react-native-reanimated";

export default function AudioPlayer() {
  const {
    currentSong,
    isPlaying,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setProgress,
    currentTime,
    duration,
    progress,
    seekToPosition,
    clearSeek,
  } = useAudioStore();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const soundRef = useRef<Audio.Sound | null>(null);
  const isLoadedRef = useRef(false);

  // Configure audio for background playback
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
      } catch (error) {
        console.error("Failed to configure audio:", error);
      }
    };

    configureAudio();
  }, []);

  // Handle app state changes to maintain playback
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === "background" && soundRef.current) {
        // Audio will continue playing in background due to configuration
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => subscription?.remove();
  }, []);

  // Load and play audio
  useEffect(() => {
    if (!currentSong) return;

    const loadAndPlay = async () => {
      try {
        // Unload previous sound
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
          isLoadedRef.current = false;
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: currentSong.fileUrl },
          {
            shouldPlay: false,
            volume: 1,
            rate: 1.0,
            shouldCorrectPitch: true,
            progressUpdateIntervalMillis: 500,
            positionMillis: 0,
          }
        );

        soundRef.current = sound;

        // Set up playback status listener
        sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
          if (!status.isLoaded) {
            isLoadedRef.current = false;
            return;
          }

          isLoadedRef.current = true;

          const currentTimeSeconds = status.positionMillis / 1000;
          const durationSeconds = status.durationMillis
            ? status.durationMillis / 1000
            : 0;
          const progressPercent = status.durationMillis
            ? (status.positionMillis / status.durationMillis) * 100
            : 0;

          setCurrentTime(currentTimeSeconds);
          setDuration(durationSeconds);
          setProgress(progressPercent);
          setProgress(progressPercent);

          // Auto-play next song when current ends
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        });

        if (isPlaying) {
          await sound.playAsync();
        }
      } catch (error) {
        console.error("Failed to load audio:", error);
        Alert.alert("Error", "Failed to load audio. Please try again.");
      }
    };

    loadAndPlay();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, [currentSong]);

  // Handle seeking
  useEffect(() => {
    if (!soundRef.current || !isLoadedRef.current || seekToPosition === null)
      return;

    const performSeek = async () => {
      try {
        const positionMillis = seekToPosition * 1000; // Convert to milliseconds
        await soundRef.current!.setPositionAsync(positionMillis);
        clearSeek();
      } catch (error) {
        console.error("Seek error:", error);
      }
    };

    performSeek();
  }, [seekToPosition, clearSeek]);

  // Handle play/pause
  useEffect(() => {
    if (!soundRef.current || !isLoadedRef.current) return;

    const updatePlayback = async () => {
      try {
        if (isPlaying) {
          await soundRef.current!.playAsync();
        } else {
          await soundRef.current!.pauseAsync();
        }
      } catch (error) {
        console.error("Playback control error:", error);
      }
    };

    updatePlayback();
  }, [isPlaying]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  if (!currentSong) return null;

  return (
    <Animated.View
      entering={SlideInDown.duration(500)}
      className="absolute left-0 right-0"
      style={{
        bottom: 64, // Position above tab bar
        paddingBottom: Math.max(insets.bottom, 8),
      }}
    >
      <LinearGradient
        colors={["rgba(236, 72, 153, 0.95)", "rgba(139, 92, 246, 0.95)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="mx-0 rounded-2xl p-4 shadow-2xl backdrop-blur-xl roundted-t-2xl"
      >
        {/* Progress Bar */}
        <View className="absolute top-0 left-0 right-0 h-1 bg-white/20 rounded-t-2xl">
          <View
            className="h-full bg-white rounded-t-2xl"
            style={{ width: `${progress}%` }}
          />
        </View>
        <Pressable
          onPress={() => router.push("/audio-page")}
          className="flex-row items-center space-x-4"
        >
          {/* Album Art */}
          <Animated.View
            entering={FadeInUp.delay(200)}
            className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xl items-center justify-center overflow-hidden"
          >
            <Text className="text-2xl">🎵</Text>
          </Animated.View>

          {/* Song Info */}
          <Animated.View entering={FadeInUp.delay(300)} className="flex-1 mx-4">
            <Text className="text-white font-bold text-base truncate">
              {currentSong.title}
            </Text>
            <Text className="text-white/80 text-sm truncate">
              {currentSong.artist}
            </Text>
          </Animated.View>

          {/* Time Display */}
          <Animated.View
            entering={FadeInUp.delay(400)}
            className="items-end mx-4"
          >
            <Text className="text-white/60 text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </Animated.View>

          {/* Play/Pause Button */}
          <Animated.View entering={FadeInUp.delay(500)}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                setIsPlaying(!isPlaying);
              }}
              className="w-12 h-12 rounded-full bg-white/25 backdrop-blur-xl items-center justify-center shadow-lg"
            >
              {isPlaying ? (
                <Pause size={20} color="white" />
              ) : (
                <Play size={20} color="white" style={{ marginLeft: 2 }} />
              )}
            </Pressable>
          </Animated.View>
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}
