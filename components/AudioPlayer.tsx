import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, AppState, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { Audio, AVPlaybackStatus } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Pause, Play, Volume2, Download } from "lucide-react-native";
import { useAudioStore } from "@/stores/useAudioStore";

export default function AudioPlayer() {
  const { currentSong, isPlaying, setIsPlaying } = useAudioStore();
  const insets = useSafeAreaInsets();
  const soundRef = useRef<Audio.Sound | null>(null);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isCached, setIsCached] = useState(false);

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

  // Get cached file path
  const getCachedFilePath = (songId: number) => {
    return `${FileSystem.cacheDirectory}song_${songId}.mp3`;
  };

  // Check if file is cached
  const checkIfCached = async (songId: number) => {
    try {
      const cachedPath = getCachedFilePath(songId);
      const fileInfo = await FileSystem.getInfoAsync(cachedPath);
      return fileInfo.exists;
    } catch {
      return false;
    }
  };

  // Download and cache the song
  const downloadAndCache = async (fileUrl: string, songId: number) => {
    try {
      const cachedPath = getCachedFilePath(songId);
      setIsLoading(true);

      const download = FileSystem.createDownloadResumable(
        fileUrl,
        cachedPath,
        {},
        (downloadProgress) => {
          // You can show download progress here if needed
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${Math.round(progress * 100)}%`);
        }
      );

      const result = await download.downloadAsync();
      if (result) {
        setIsCached(true);
        return result.uri;
      }
    } catch (error) {
      console.error("Failed to cache song:", error);
    } finally {
      setIsLoading(false);
    }
    return fileUrl; // Fallback to streaming
  };

  // Load and play audio
  useEffect(() => {
    if (!currentSong) return;

    const loadAndPlay = async () => {
      setIsLoading(true);
      setIsBuffering(true);

      try {
        // Unload previous sound
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        // Check if song is cached
        const cached = await checkIfCached(currentSong.id);
        setIsCached(cached);

        let sourceUri = currentSong.fileUrl;

        // Use cached version if available, otherwise cache it
        if (cached) {
          sourceUri = getCachedFilePath(currentSong.id);
        } else {
          // Start downloading in background for next time
          downloadAndCache(currentSong.fileUrl, currentSong.id);
        }

        const { sound } = await Audio.Sound.createAsync(
          { uri: sourceUri },
          {
            shouldPlay: false,
            volume: volume,
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
            setIsBuffering(true);
            return;
          }

          setIsBuffering(status.isBuffering || false);
          setCurrentTime(status.positionMillis / 1000);
          setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
          setProgress(
            status.durationMillis
              ? (status.positionMillis / status.durationMillis) * 100
              : 0
          );

          // Auto-play next song when current ends
          if (status.didJustFinish) {
            setIsPlaying(false);
            // You can implement auto-next functionality here
          }
        });

        if (isPlaying) {
          await sound.playAsync();
        }
      } catch (error) {
        console.error("Failed to load audio:", error);
        Alert.alert("Error", "Failed to load audio. Please try again.");
      } finally {
        setIsLoading(false);
        setIsBuffering(false);
      }
    };

    loadAndPlay();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, [currentSong]);

  // Handle play/pause
  useEffect(() => {
    if (!soundRef.current) return;

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

  // Handle volume changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.setVolumeAsync(volume);
    }
  }, [volume]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleSeek = async (value: number) => {
    if (!soundRef.current || !duration) return;
    try {
      const positionMillis = (value / 100) * duration * 1000;
      await soundRef.current.setPositionAsync(positionMillis);
    } catch (error) {
      console.error("Seek error:", error);
    }
  };

  const handleCacheToggle = async () => {
    if (!currentSong) return;

    if (isCached) {
      // Remove from cache
      try {
        const cachedPath = getCachedFilePath(currentSong.id);
        await FileSystem.deleteAsync(cachedPath);
        setIsCached(false);
      } catch (error) {
        console.error("Failed to remove from cache:", error);
      }
    } else {
      // Cache the song
      await downloadAndCache(currentSong.fileUrl, currentSong.id);
    }
  };

  if (!currentSong) return null;

  return (
    <View
      className="absolute left-0 right-0 bg-neutral-900 p-4 space-y-4 border-t border-neutral-700"
      style={{
        bottom: 83, // Position above tab bar (typical tab bar height is ~83px)
        paddingBottom: Math.max(insets.bottom, 8),
      }}
    >
      {/* Song Info */}
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-white font-semibold text-lg truncate">
            {currentSong.title}
          </Text>
          <Text className="text-gray-400 text-sm truncate">
            {currentSong.artist}
          </Text>
          {(isLoading || isBuffering) && (
            <Text className="text-yellow-400 text-xs">
              {isLoading ? "Loading..." : "Buffering..."}
            </Text>
          )}
        </View>

        {/* Cache button */}
        <Pressable onPress={handleCacheToggle} className="ml-2 p-2">
          <Download
            size={20}
            color={isCached ? "#22c55e" : "#6b7280"}
            fill={isCached ? "#22c55e" : "none"}
          />
        </Pressable>
      </View>

      {/* Controls */}
      <View className="flex-row items-center justify-between">
        {/* Play/Pause */}
        <Pressable
          onPress={() => setIsPlaying(!isPlaying)}
          className="bg-neutral-700 p-3 rounded-full"
          disabled={isLoading}
        >
          {isPlaying ? (
            <Pause size={24} color="white" />
          ) : (
            <Play size={24} color="white" />
          )}
        </Pressable>

        {/* Time + Progress Bar */}
        <View className="flex-1 mx-4">
          <View className="flex-row justify-between mb-1">
            <Text className="text-xs text-white">
              {formatTime(currentTime)}
            </Text>
            <Text className="text-xs text-white">{formatTime(duration)}</Text>
          </View>
          <Slider
            value={progress}
            onValueChange={handleSeek}
            minimumValue={0}
            maximumValue={100}
            minimumTrackTintColor="#ec4899"
            maximumTrackTintColor="#aaa"
            thumbTintColor="#ec4899"
            disabled={isLoading}
          />
        </View>

        {/* Volume */}
        <View className="flex-row items-center gap-2 w-24 ml-2">
          <Volume2 size={18} color="white" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            minimumValue={0}
            maximumValue={1}
            step={0.01}
            style={{ width: 80 }}
            minimumTrackTintColor="#ec4899"
            thumbTintColor="#ec4899"
          />
        </View>
      </View>
    </View>
  );
}
