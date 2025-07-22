import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  Plus,
  Music,
  Clock,
  Play,
  Shuffle,
  MoreVertical,
  X,
  Search,
  Headphones,
} from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import usePlaylistStore, { Playlist } from "../stores/usePlaylistStore";
import { useAudioStore } from "../stores/useAudioStore";

export default function PlaylistsPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const { playlists, isLoading, fetchPlaylists, createPlaylist } =
    usePlaylistStore();

  const { setQueue, setCurrentSong } = useAudioStore();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const filteredPlaylists = playlists.filter((playlist: Playlist) =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName.trim()) {
      Alert.alert("Error", "Please enter a playlist name");
      return;
    }

    try {
      await createPlaylist({
        name: newPlaylistName.trim(),
        description: newPlaylistDescription.trim(),
        isPublic,
      });

      setNewPlaylistName("");
      setNewPlaylistDescription("");
      setIsPublic(false);
      setShowCreateModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to create playlist");
    }
  };

  const playPlaylist = (playlist: Playlist) => {
    if (!playlist.songs || playlist.songs.length === 0) {
      Alert.alert("Empty Playlist", "This playlist has no songs to play");
      return;
    }

    const queue = playlist.songs.map((song: any) => ({
      id: song.id,
      title: song.title,
      artist: song.artist,
      duration: song.duration,
      fileUrl: song.fileUrl,
    }));

    setQueue(queue, 0);
    setCurrentSong(queue[0]);
  };

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
        {/* Header Title */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <LinearGradient
              colors={["#ec4899", "#8b5cf6"]}
              className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
            >
              <Music size={24} color="white" />
            </LinearGradient>
            <View>
              <Text className="text-white text-3xl font-bold">
                Your Playlists
              </Text>
              <Text className="text-gray-400 text-sm">
                {playlists.length} playlists
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            className="bg-green-500 p-3 rounded-full"
          >
            <Plus size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="bg-white/10 rounded-xl px-4 py-3 flex-row items-center mb-4">
          <Search size={20} color="#9ca3af" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search playlists..."
            placeholderTextColor="#9ca3af"
            className="text-white ml-3 flex-1"
          />
        </View>
      </Animated.View>
    </LinearGradient>
  );

  const renderPlaylistItem = ({
    item,
    index,
  }: {
    item: Playlist;
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
              {/* Playlist Cover */}
              <LinearGradient
                colors={["#ec4899", "#8b5cf6"]}
                className="w-16 h-16 rounded-xl items-center justify-center mr-4"
              >
                <Music size={24} color="white" />
              </LinearGradient>

              {/* Playlist Info */}
              <View className="flex-1">
                <Text className="text-white text-lg font-semibold mb-1">
                  {item.name}
                </Text>
                {item.description && (
                  <Text
                    className="text-gray-400 text-sm mb-1"
                    numberOfLines={1}
                  >
                    {item.description}
                  </Text>
                )}
                <View className="flex-row items-center">
                  <Text className="text-gray-500 text-xs">
                    {item.songCount || item.songs?.length || 0} songs
                  </Text>
                  {item.isPublic && (
                    <>
                      <Text className="text-gray-500 text-xs mx-2">•</Text>
                      <Text className="text-green-400 text-xs">Public</Text>
                    </>
                  )}
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row items-center space-x-2">
              {(item.songs?.length || 0) > 0 && (
                <TouchableOpacity
                  onPress={() => playPlaylist(item)}
                  className="bg-green-500/20 p-2 rounded-full"
                >
                  <Play size={16} color="#10b981" fill="#10b981" />
                </TouchableOpacity>
              )}

              <TouchableOpacity className="bg-white/10 p-2 rounded-full">
                <MoreVertical size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
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
        No playlists yet
      </Text>
      <Text className="text-gray-500 text-sm text-center mb-6">
        Create your first playlist to organize your music
      </Text>
      <TouchableOpacity
        onPress={() => setShowCreateModal(true)}
        className="bg-purple-500 px-6 py-3 rounded-2xl flex-row items-center"
      >
        <Plus size={20} color="white" />
        <Text className="text-white font-medium ml-2">Create Playlist</Text>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-black">
        {/* Modal Header */}
        <View
          className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800"
          style={{ paddingTop: insets.top + 16 }}
        >
          <TouchableOpacity onPress={() => setShowCreateModal(false)}>
            <X size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-medium">
            Create Playlist
          </Text>
          <TouchableOpacity
            onPress={handleCreatePlaylist}
            disabled={!newPlaylistName.trim()}
            className={`px-4 py-2 rounded-xl ${
              newPlaylistName.trim() ? "bg-green-500" : "bg-gray-600"
            }`}
          >
            <Text className="text-white font-medium">Create</Text>
          </TouchableOpacity>
        </View>

        {/* Form */}
        <View className="p-6">
          <View className="items-center mb-8">
            <LinearGradient
              colors={["#ec4899", "#8b5cf6"]}
              className="w-32 h-32 rounded-3xl items-center justify-center mb-4"
            >
              <Music size={48} color="white" />
            </LinearGradient>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-white text-sm font-medium mb-2">
                Playlist Name
              </Text>
              <TextInput
                value={newPlaylistName}
                onChangeText={setNewPlaylistName}
                placeholder="Enter playlist name..."
                placeholderTextColor="#9ca3af"
                className="bg-gray-800 text-white rounded-xl px-4 py-3"
              />
            </View>

            <View>
              <Text className="text-white text-sm font-medium mb-2">
                Description
              </Text>
              <TextInput
                value={newPlaylistDescription}
                onChangeText={setNewPlaylistDescription}
                placeholder="Add a description..."
                placeholderTextColor="#9ca3af"
                className="bg-gray-800 text-white rounded-xl px-4 py-3"
                multiline
                numberOfLines={3}
              />
            </View>

            <View>
              <TouchableOpacity
                onPress={() => setIsPublic(!isPublic)}
                className="flex-row items-center justify-between p-4 bg-gray-800 rounded-xl"
              >
                <View>
                  <Text className="text-white font-medium">
                    Make playlist public
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Anyone can search and view this playlist
                  </Text>
                </View>
                <View
                  className={`w-6 h-6 rounded border-2 items-center justify-center ${
                    isPublic
                      ? "bg-green-500 border-green-500"
                      : "border-gray-600"
                  }`}
                >
                  {isPublic && <Text className="text-white text-xs">✓</Text>}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={filteredPlaylists}
        renderItem={renderPlaylistItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{
          paddingBottom: 250,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading}
        onRefresh={fetchPlaylists}
      />

      {renderCreateModal()}
    </View>
  );
}
