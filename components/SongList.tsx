import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, ListRenderItem } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import MemoizedSongCard from "./MemoizedSongCard";
import SearchHeader from "./SearchHeader";
import EmptyState from "./EmptyState";
import axiosInstance from "../utils/axios";

interface Song {
  id: number;
  title: string;
  artist?: string;
  duration: string;
}

export default function SongList() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
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

  const handleSearch = async () => {
    if (!query.trim()) {
      setDisplayedSongs(allSongs);
      return;
    }

    setIsFetching(true);
    try {
      const res = await axiosInstance.post("/songs/search", {
        query: query.trim(),
      });
      setDisplayedSongs(res.data || []);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    setDisplayedSongs(allSongs);
  };

  const renderSongItem: ListRenderItem<Song> = useCallback(
    ({ item, index }) => (
      <Animated.View entering={FadeInDown.delay(Math.min(index * 30, 500))}>
        <MemoizedSongCard
          id={item.id}
          title={item.title}
          artist={item.artist || "Unknown"}
          duration={item.duration || "0:00"}
          fileUrl={`${process.env.EXPO_PUBLIC_BACKEND_URL}/stream/${item.id}`}
        />
      </Animated.View>
    ),
    []
  );

  const keyExtractor = useCallback((item: Song) => item.id.toString(), []);

  const renderEmptyComponent = useCallback(() => {
    if (isLoading || isFetching) return null;
    return <EmptyState hasQuery={!!query.trim()} />;
  }, [isLoading, isFetching, query]);

  const renderHeader = useCallback(
    () => (
      <SearchHeader
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        onClear={handleClearSearch}
        songsCount={displayedSongs.length}
        isLoading={isLoading}
        isFetching={isFetching}
      />
    ),
    [query, displayedSongs.length, isLoading, isFetching]
  );

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={displayedSongs}
        renderItem={renderSongItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 250, // room for audio player + safe area
          flexGrow: 1,
        }}
        ItemSeparatorComponent={() => <View className="h-1" />}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        initialNumToRender={8}
        maxToRenderPerBatch={3}
        windowSize={5}
        updateCellsBatchingPeriod={50}
        getItemLayout={(data, index) => ({
          length: 80, // Approximate height of each song card
          offset: 80 * index,
          index,
        })}
        style={{ paddingHorizontal: 16 }}
        legacyImplementation={false}
      />
    </View>
  );
}
