import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { Pause, Play, Volume2 } from "lucide-react-native";
import { useAudioStore } from "@/stores/useAudioStore";

export default function AudioPlayer() {
  const { currentSong, isPlaying, setIsPlaying } = useAudioStore();
  const soundRef = useRef<Audio.Sound | null>(null);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (!currentSong) return;

    const loadAndPlay = async () => {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: currentSong.fileUrl },
        { shouldPlay: isPlaying, volume }
      );

      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        setCurrentTime(status.positionMillis / 1000);
        setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
        setProgress(
          status.durationMillis
            ? (status.positionMillis / status.durationMillis) * 100
            : 0
        );
      });
    };

    loadAndPlay();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, [currentSong]);

  useEffect(() => {
    if (!soundRef.current) return;

    isPlaying ? soundRef.current.playAsync() : soundRef.current.pauseAsync();
  }, [isPlaying]);

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
    const positionMillis = (value / 100) * duration * 1000;
    await soundRef.current.setPositionAsync(positionMillis);
  };

  if (!currentSong) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-neutral-900 p-4 space-y-4">
      {/* Song Info */}
      <View>
        <Text className="text-white font-semibold text-lg truncate">
          {currentSong.title}
        </Text>
        <Text className="text-gray-400 text-sm truncate">
          {currentSong.artist}
        </Text>
      </View>

      {/* Controls */}
      <View className="flex-row items-center justify-between">
        {/* Play/Pause */}
        <Pressable
          onPress={() => setIsPlaying(!isPlaying)}
          className="bg-neutral-700 p-3 rounded-full"
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
