import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Heart,
  Clock,
  TrendingUp,
  Play,
  Music,
  Calendar,
  List,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useLibraryStore, {
  LikedSong,
  RecentSong,
  MostPlayedSong,
} from "../../stores/useLibraryStore";
import usePlaylistStore from "../../stores/usePlaylistStore";
import { useAudioStore } from "../../stores/useAudioStore";
import SongCard from "../../components/SongCard";

type LibrarySection = "liked" | "recent" | "mostPlayed" | "playlists";

export default function LibraryPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeSection, setActiveSection] = useState<LibrarySection>("liked");
  const [timeframe, setTimeframe] = useState("month");

  const {
    likedSongs,
    recentSongs,
    mostPlayedSongs,
    isLoading,
    fetchLikedSongs,
    fetchRecentSongs,
    fetchMostPlayedSongs,
  } = useLibraryStore();

  const { playlists, fetchPlaylists } = usePlaylistStore();

  const { setQueue, setCurrentSong } = useAudioStore();

  useEffect(() => {
    // Fetch all library data on mount
    fetchLikedSongs();
    fetchRecentSongs();
    fetchMostPlayedSongs(timeframe);
    fetchPlaylists();
  }, [timeframe]);

  const playAllSongs = (songs: (LikedSong | RecentSong | MostPlayedSong)[]) => {
    if (songs.length === 0) return;

    const queue = songs.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      fileUrl: song.fileUrl,
    }));

    setQueue(queue, 0);
    setCurrentSong(queue[0]);
  };

  const getSectionTitle = () => {
    switch (activeSection) {
      case "liked":
        return "Liked Songs";
      case "recent":
        return "Recently Played";
      case "mostPlayed":
        return `Most Played (${timeframe})`;
      case "playlists":
        return "Your Playlists";
      default:
        return "Library";
    }
  };

  const getSectionIcon = () => {
    switch (activeSection) {
      case "liked":
        return <Heart size={24} color="white" />;
      case "recent":
        return <Clock size={24} color="white" />;
      case "mostPlayed":
        return <TrendingUp size={24} color="white" />;
      case "playlists":
        return <List size={24} color="white" />;
      default:
        return <Music size={24} color="white" />;
    }
  };

  const getCurrentSongs = () => {
    switch (activeSection) {
      case "liked":
        return likedSongs;
      case "recent":
        return recentSongs;
      case "mostPlayed":
        return mostPlayedSongs;
      default:
        return [];
    }
  };

  const renderSectionTabs = () => (
    <Animated.View entering={FadeInUp.delay(200)} className="px-4 mb-4">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-3">
          {[
            {
              key: "liked",
              label: "Liked",
              icon: Heart,
              count: likedSongs.length,
            },
            {
              key: "recent",
              label: "Recent",
              icon: Clock,
              count: recentSongs.length,
            },
            {
              key: "mostPlayed",
              label: "Top",
              icon: TrendingUp,
              count: mostPlayedSongs.length,
            },
            {
              key: "playlists",
              label: "Playlists",
              icon: List,
              count: playlists.length,
            },
          ].map(({ key, label, icon: Icon, count }) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveSection(key as LibrarySection)}
              className={`px-4 py-2 rounded-2xl flex-row items-center space-x-2 ${
                activeSection === key ? "bg-pink-500" : "bg-white/10"
              }`}
            >
              <Icon size={16} color="white" />
              <Text className="text-white font-medium">{label}</Text>
              <View className="bg-white/20 px-2 py-1 rounded-full">
                <Text className="text-white text-xs">{count}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );

  const renderHeader = () => (
    <LinearGradient
      colors={[
        "rgba(236, 72, 153, 0.3)",
        "rgba(139, 92, 246, 0.2)",
        "rgba(0, 0, 0, 0.9)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="pt-4 pb-6 px-4"
    >
      {/* Header Title */}
      <Animated.View entering={FadeInDown.delay(100)}>
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <LinearGradient
              colors={["#ec4899", "#8b5cf6"]}
              className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
            >
              {getSectionIcon()}
            </LinearGradient>
            <View>
              <Text className="text-white text-3xl font-bold">
                {getSectionTitle()}
              </Text>
              <Text className="text-gray-400 text-sm">
                {getCurrentSongs().length} songs
              </Text>
            </View>
          </View>

          {getCurrentSongs().length > 0 && (
            <TouchableOpacity
              onPress={() => playAllSongs(getCurrentSongs())}
              className="bg-green-500 p-3 rounded-full"
            >
              <Play size={20} color="white" fill="white" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Timeframe selector for Most Played */}
      {activeSection === "mostPlayed" && (
        <Animated.View entering={FadeInUp.delay(300)} className="mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row space-x-2">
              {["week", "month", "year", "all"].map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setTimeframe(period)}
                  className={`px-3 py-1 rounded-xl ${
                    timeframe === period ? "bg-purple-500" : "bg-white/10"
                  }`}
                >
                  <Text className="text-white text-sm capitalize">
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      )}
    </LinearGradient>
  );

  const renderSongItem = ({
    item,
    index,
  }: {
    item: LikedSong | RecentSong | MostPlayedSong;
    index: number;
  }) => (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <View className="mb-2">
        <SongCard
          id={item.id}
          title={item.title}
          artist={item.artist}
          duration={item.duration}
          fileUrl={item.fileUrl}
        />

        {/* Additional metadata */}
        <View className="px-4 pt-2 pb-1">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center space-x-4">
              {activeSection === "recent" && "lastPlayed" in item && (
                <View className="flex-row items-center">
                  <Clock size={12} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs ml-1">
                    {new Date(item.lastPlayed).toLocaleDateString()}
                  </Text>
                </View>
              )}

              {activeSection === "liked" && "likedAt" in item && (
                <View className="flex-row items-center">
                  <Heart size={12} color="#ec4899" />
                  <Text className="text-gray-400 text-xs ml-1">
                    {new Date(item.likedAt).toLocaleDateString()}
                  </Text>
                </View>
              )}

              {(activeSection === "mostPlayed" || activeSection === "recent") &&
                "playCount" in item && (
                  <View className="flex-row items-center">
                    <Play size={12} color="#10b981" />
                    <Text className="text-gray-400 text-xs ml-1">
                      {item.playCount} plays
                    </Text>
                  </View>
                )}
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderPlaylistItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => (
    <Animated.View entering={FadeInDown.delay(index * 50)}>
      <TouchableOpacity
        onPress={() => router.push(`/playlist/${item.id}`)}
        className="mx-4 mb-4 rounded-2xl overflow-hidden"
      >
        <LinearGradient
          colors={["rgba(255, 255, 255, 0.05)", "rgba(255, 255, 255, 0.02)"]}
          className="p-4"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <LinearGradient
                colors={["#ec4899", "#8b5cf6"]}
                className="w-14 h-14 rounded-xl items-center justify-center mr-4"
              >
                <Music size={20} color="white" />
              </LinearGradient>

              <View className="flex-1">
                <Text className="text-white text-lg font-semibold mb-1">
                  {item.name}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {item.songCount || item.songs?.length || 0} songs
                </Text>
              </View>
            </View>

            <TouchableOpacity className="bg-white/10 p-2 rounded-full">
              <Play size={16} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  const getCurrentData = ():
    | (LikedSong | RecentSong | MostPlayedSong)[]
    | any[] => {
    if (activeSection === "playlists") {
      return playlists;
    }
    return getCurrentSongs();
  };

  const renderMainContent = () => {
    const data = getCurrentData();

    return (
      <FlatList
        data={data as any[]}
        renderItem={
          activeSection === "playlists" ? renderPlaylistItem : renderSongItem
        }
        keyExtractor={(item: any) =>
          activeSection === "playlists"
            ? `playlist-${item.id}`
            : `${activeSection}-${item.id}`
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{
          paddingBottom: 250,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={() => {
          switch (activeSection) {
            case "liked":
              fetchLikedSongs();
              break;
            case "recent":
              fetchRecentSongs();
              break;
            case "mostPlayed":
              fetchMostPlayedSongs(timeframe);
              break;
            case "playlists":
              fetchPlaylists();
              break;
          }
        }}
      />
    );
  };

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeInDown.delay(300)}
      className="flex-1 justify-center items-center py-20"
    >
      <LinearGradient
        colors={["rgba(236, 72, 153, 0.1)", "rgba(139, 92, 246, 0.1)"]}
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
      >
        {getSectionIcon()}
      </LinearGradient>
      <Text className="text-gray-400 text-lg text-center font-medium mb-2">
        {activeSection === "playlists"
          ? "No playlists yet"
          : `No ${
              activeSection === "liked"
                ? "liked"
                : activeSection === "recent"
                ? "recent"
                : "top"
            } songs yet`}
      </Text>
      <Text className="text-gray-500 text-sm text-center mb-6">
        {activeSection === "playlists"
          ? "Create playlists to organize your music"
          : activeSection === "liked"
          ? "Heart songs to build your favorites collection"
          : activeSection === "recent"
          ? "Your recently played songs will appear here"
          : "Your most played songs will appear here"}
      </Text>
      {activeSection === "playlists" && (
        <TouchableOpacity
          onPress={() => router.push("/playlists")}
          className="bg-purple-500 px-6 py-3 rounded-2xl flex-row items-center"
        >
          <List size={20} color="white" />
          <Text className="text-white font-medium ml-2">Manage Playlists</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-black">
      {renderSectionTabs()}
      {renderMainContent()}
    </View>
  );
}
