import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Pressable,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Play,
  Shuffle,
  Heart,
  Share,
  MoreVertical,
  Edit,
  Trash2,
  Plus,
  X,
  Search,
  Music,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import usePlaylistStore, {
  PlaylistSong,
  Song,
} from "../../stores/usePlaylistStore";
import useLibraryStore from "../../stores/useLibraryStore";
import { useAudioStore } from "../../stores/useAudioStore";
import SongCard from "../../components/SongCard";

export default function PlaylistDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [showMenu, setShowMenu] = useState(false);
  const [showAddSongs, setShowAddSongs] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const {
    currentPlaylist,
    allSongs,
    isLoading,
    fetchPlaylistById,
    addSongToPlaylist,
    removeSongFromPlaylist,
    updatePlaylist,
    deletePlaylist,
    fetchAllSongs,
  } = usePlaylistStore();

  const { toggleLike, likedSongs } = useLibraryStore();
  const { setQueue, setCurrentSong } = useAudioStore();

  useEffect(() => {
    if (id) {
      fetchPlaylistById(id);
      fetchAllSongs();
    }
  }, [id]);

  useEffect(() => {
    if (currentPlaylist) {
      setEditName(currentPlaylist.name);
      setEditDescription(currentPlaylist.description || "");
    }
  }, [currentPlaylist]);

  const playAllSongs = (shuffle = false) => {
    if (!currentPlaylist?.songs || currentPlaylist.songs.length === 0) return;

    let queue = currentPlaylist.songs.map((song) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      fileUrl: song.fileUrl,
    }));

    if (shuffle) {
      queue = queue.sort(() => Math.random() - 0.5);
    }

    setQueue(queue, 0);
    setCurrentSong(queue[0]);
  };

  const handleDeletePlaylist = () => {
    Alert.alert(
      "Delete Playlist",
      `Are you sure you want to delete "${currentPlaylist?.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            if (id) {
              await deletePlaylist(id);
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleUpdatePlaylist = async () => {
    if (!id || !editName.trim()) return;

    await updatePlaylist(id, {
      name: editName.trim(),
      description: editDescription.trim() || undefined,
    });
    setIsEditing(false);
  };

  const filteredSongs = allSongs.filter(
    (song: Song) =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const songsInPlaylist = new Set(
    currentPlaylist?.songs?.map((s) => s.id) || []
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
      <Animated.View entering={FadeInDown.delay(100)}>
        {/* Header Controls */}
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <X size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowMenu(true)}
            className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
          >
            <MoreVertical size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Playlist Info */}
        <View className="items-center mb-8">
          <LinearGradient
            colors={["#ec4899", "#8b5cf6"]}
            className="w-32 h-32 rounded-3xl items-center justify-center mb-4"
          >
            <Music size={48} color="white" />
          </LinearGradient>

          {isEditing ? (
            <View className="w-full space-y-3">
              <TextInput
                value={editName}
                onChangeText={setEditName}
                className="text-white text-2xl font-bold text-center bg-white/10 rounded-xl px-4 py-2"
                placeholder="Playlist name"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                value={editDescription}
                onChangeText={setEditDescription}
                className="text-gray-400 text-center bg-white/10 rounded-xl px-4 py-2"
                placeholder="Add description..."
                placeholderTextColor="#9ca3af"
                multiline
              />
              <View className="flex-row space-x-3 justify-center">
                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  className="bg-gray-600 px-4 py-2 rounded-xl"
                >
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUpdatePlaylist}
                  className="bg-green-500 px-4 py-2 rounded-xl"
                >
                  <Text className="text-white">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text className="text-white text-3xl font-bold text-center mb-2">
                {currentPlaylist?.name}
              </Text>
              {currentPlaylist?.description && (
                <Text className="text-gray-400 text-center mb-2">
                  {currentPlaylist.description}
                </Text>
              )}
              <Text className="text-gray-500 text-sm">
                {currentPlaylist?.songs?.length || 0} songs
              </Text>
            </>
          )}
        </View>

        {/* Action Buttons */}
        {!isEditing &&
          currentPlaylist?.songs &&
          currentPlaylist.songs.length > 0 && (
            <View className="flex-row space-x-4 justify-center">
              <TouchableOpacity
                onPress={() => playAllSongs(false)}
                className="bg-green-500 flex-row items-center px-6 py-3 rounded-2xl"
              >
                <Play size={20} color="white" fill="white" />
                <Text className="text-white font-medium ml-2">Play</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => playAllSongs(true)}
                className="bg-white/10 flex-row items-center px-6 py-3 rounded-2xl"
              >
                <Shuffle size={20} color="white" />
                <Text className="text-white font-medium ml-2">Shuffle</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowAddSongs(true)}
                className="bg-purple-500 flex-row items-center px-6 py-3 rounded-2xl"
              >
                <Plus size={20} color="white" />
                <Text className="text-white font-medium ml-2">Add</Text>
              </TouchableOpacity>
            </View>
          )}
      </Animated.View>
    </LinearGradient>
  );

  const renderSongItem = ({
    item,
    index,
  }: {
    item: PlaylistSong;
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
          showRemove
          onRemove={() => {
            if (id) {
              removeSongFromPlaylist(id, item.id);
            }
          }}
        />
      </View>
    </Animated.View>
  );

  const renderEmptyState = () => (
    <Animated.View
      entering={FadeInDown.delay(300)}
      className="flex-1 justify-center items-center py-20"
    >
      <LinearGradient
        colors={["rgba(236, 72, 153, 0.1)", "rgba(139, 92, 246, 0.1)"]}
        className="w-24 h-24 rounded-full items-center justify-center mb-6"
      >
        <Music size={32} color="white" />
      </LinearGradient>
      <Text className="text-gray-400 text-lg text-center font-medium mb-2">
        No songs in this playlist yet
      </Text>
      <Text className="text-gray-500 text-sm text-center mb-6">
        Add some songs to get started
      </Text>
      <TouchableOpacity
        onPress={() => setShowAddSongs(true)}
        className="bg-purple-500 px-6 py-3 rounded-2xl flex-row items-center"
      >
        <Plus size={20} color="white" />
        <Text className="text-white font-medium ml-2">Add Songs</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderAddSongsModal = () => (
    <Modal
      visible={showAddSongs}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-black">
        {/* Modal Header */}
        <View
          className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800"
          style={{ paddingTop: insets.top + 16 }}
        >
          <TouchableOpacity onPress={() => setShowAddSongs(false)}>
            <X size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-medium">Add Songs</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View className="px-4 py-3">
          <View className="bg-gray-800 rounded-xl px-4 py-3 flex-row items-center">
            <Search size={20} color="#9ca3af" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search songs..."
              placeholderTextColor="#9ca3af"
              className="text-white ml-3 flex-1"
            />
          </View>
        </View>

        {/* Songs List */}
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (id && !songsInPlaylist.has(item.id)) {
                  addSongToPlaylist(id, item.id);
                }
              }}
              disabled={songsInPlaylist.has(item.id)}
              className={`px-4 py-3 flex-row items-center ${
                songsInPlaylist.has(item.id) ? "opacity-50" : ""
              }`}
            >
              <View className="flex-1">
                <Text className="text-white font-medium">{item.title}</Text>
                <Text className="text-gray-400 text-sm">{item.artist}</Text>
              </View>
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  songsInPlaylist.has(item.id)
                    ? "bg-green-500 border-green-500"
                    : "border-gray-600"
                }`}
              >
                {songsInPlaylist.has(item.id) && (
                  <Text className="text-white text-xs">✓</Text>
                )}
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </View>
    </Modal>
  );

  const renderMenuModal = () => (
    <Modal
      visible={showMenu}
      transparent
      animationType="fade"
      onRequestClose={() => setShowMenu(false)}
    >
      <Pressable
        className="flex-1 bg-black/50"
        onPress={() => setShowMenu(false)}
      >
        <View className="flex-1 justify-end">
          <View
            className="bg-gray-900 rounded-t-3xl p-6"
            style={{ paddingBottom: insets.bottom + 24 }}
          >
            <View className="w-12 h-1 bg-gray-600 rounded-full self-center mb-6" />

            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                setIsEditing(true);
              }}
              className="flex-row items-center py-3"
            >
              <Edit size={20} color="white" />
              <Text className="text-white ml-3 text-lg">Edit Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                // TODO: Implement share functionality
              }}
              className="flex-row items-center py-3"
            >
              <Share size={20} color="white" />
              <Text className="text-white ml-3 text-lg">Share Playlist</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                handleDeletePlaylist();
              }}
              className="flex-row items-center py-3"
            >
              <Trash2 size={20} color="#ef4444" />
              <Text className="text-red-400 ml-3 text-lg">Delete Playlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );

  if (!currentPlaylist && !isLoading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white text-xl">Playlist not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 bg-purple-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={currentPlaylist?.songs || []}
        renderItem={renderSongItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{
          paddingBottom: 250,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      />

      {renderAddSongsModal()}
      {renderMenuModal()}
    </View>
  );
}
