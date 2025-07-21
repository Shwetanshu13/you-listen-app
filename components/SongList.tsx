import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Search, Filter, Music } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useDebounce } from "@/hooks/useDebounce";
import SongCard from "./SongCard";
import axiosInstance from "@/utils/axios";

interface Song {
  id: number;
  title: string;
  artist?: string;
  duration: string;
}

export default function SongList() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [displayedSongs, setDisplayedSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        const res = await axiosInstance.get("/songs/all");
        setAllSongs(res.data);
        setDisplayedSongs(res.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllSongs();
  }, []);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setDisplayedSongs(allSongs);
    } else {
      handleSearch();
    }
  }, [debouncedQuery]);

  const handleSearch = async () => {
    if (!debouncedQuery.trim()) {
      setDisplayedSongs(allSongs);
      return;
    }

    setIsFetching(true);
    try {
      const res = await axiosInstance.get("/songs/search", {
        params: { query: debouncedQuery },
      });
      setDisplayedSongs(res.data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      {/* Header with gradient */}
      <LinearGradient
        colors={[
          "rgba(236, 72, 153, 0.2)",
          "rgba(139, 92, 246, 0.1)",
          "rgba(0, 0, 0, 0.9)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pt-4 pb-6 px-4"
      >
        <Animated.View entering={FadeInDown.delay(100)}>
          <View className="flex-row items-center mb-6">
            <LinearGradient
              colors={["#ec4899", "#8b5cf6"]}
              className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
            >
              <Music size={24} color="white" />
            </LinearGradient>
            <Text className="text-white text-3xl font-bold">Music Library</Text>
          </View>
        </Animated.View>

        {/* Search Bar */}
        <Animated.View entering={FadeInUp.delay(200)} className="relative">
          <LinearGradient
            colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
            className="rounded-2xl p-1 border border-white/20"
          >
            <View className="flex-row items-center bg-black/30 rounded-xl px-4 py-3">
              <Search size={20} color="#9ca3af" className="mr-3" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search for songs, artists..."
                placeholderTextColor="#6b7280"
                className="flex-1 text-white text-base"
                style={{ fontSize: 16 }}
              />
              <Pressable onPress={handleSearch} className="ml-3">
                <LinearGradient
                  colors={["#ec4899", "#8b5cf6"]}
                  className="px-4 py-2 rounded-xl"
                >
                  <Filter size={16} color="white" />
                </LinearGradient>
              </Pressable>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats */}
        <Animated.View
          entering={FadeInUp.delay(300)}
          className="flex-row justify-between mt-4"
        >
          <Text className="text-gray-400 text-sm">
            {displayedSongs.length} songs
          </Text>
          {(isLoading || isFetching) && (
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-pink-400 rounded-full mr-2 animate-pulse" />
              <Text className="text-pink-400 text-sm">Loading...</Text>
            </View>
          )}
        </Animated.View>
      </LinearGradient>

      {/* Song List */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 250 }}
      >
        {displayedSongs.length === 0 && !isFetching && !isLoading ? (
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
              {query ? "No songs found" : "No songs available"}
            </Text>
            <Text className="text-gray-500 text-sm text-center mt-2">
              {query
                ? "Try a different search term"
                : "Upload some music to get started"}
            </Text>
          </Animated.View>
        ) : (
          <View className="mt-2">
            {displayedSongs.map((song: Song, index: number) => (
              <Animated.View
                key={song.id}
                entering={FadeInDown.delay(index * 100)}
              >
                <SongCard
                  id={song.id}
                  title={song.title}
                  artist={song.artist || "Unknown"}
                  duration={song.duration || "0:00"}
                  fileUrl={`${process.env.EXPO_PUBLIC_BACKEND_URL}/stream/${song.id}`}
                />
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
