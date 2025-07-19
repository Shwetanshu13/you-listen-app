import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
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
    <ScrollView className="p-4">
      <View className="flex-row items-center gap-2 mb-4">
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search songs..."
          placeholderTextColor="#aaa"
          className="bg-neutral-800 text-white p-3 rounded flex-1"
        />
        <Pressable
          onPress={handleSearch}
          className="bg-pink-600 px-4 py-2 rounded"
        >
          <Text className="text-white">Search</Text>
        </Pressable>
      </View>

      {(isLoading || isFetching) && (
        <Text className="text-gray-400">Loading...</Text>
      )}
      {displayedSongs.length === 0 && !isFetching && (
        <Text className="text-gray-500">No songs found.</Text>
      )}

      {displayedSongs.map((song: Song) => (
        <SongCard
          key={song.id}
          id={song.id}
          title={song.title}
          artist={song.artist || "Unknown"}
          duration={song.duration || "0:00"}
          fileUrl={`${process.env.EXPO_PUBLIC_BACKEND_URL}/stream/${song.id}`}
        />
      ))}
    </ScrollView>
  );
}
