import { View, Text, TextInput, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Search, Filter, Music, X } from "lucide-react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

interface SearchHeaderProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
  onClear?: () => void;
  songsCount: number;
  isLoading: boolean;
  isFetching: boolean;
}

export default function SearchHeader({
  query,
  onQueryChange,
  onSearch,
  onClear,
  songsCount,
  isLoading,
  isFetching,
}: SearchHeaderProps) {
  return (
    <LinearGradient
      colors={[
        "rgba(236, 72, 153, 0.2)",
        "rgba(139, 92, 246, 0.1)",
        "rgba(0, 0, 0, 0.9)",
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="p-3 my-3 rounded-lg"
    >
      {/* Title */}
      <Animated.View entering={FadeInDown.delay(100)}>
        <View className="flex-row items-center my-4">
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
              onChangeText={onQueryChange}
              placeholder="Search for songs, artists..."
              placeholderTextColor="#6b7280"
              className="flex-1 text-white text-base"
              style={{ fontSize: 16 }}
              returnKeyType="search"
              onSubmitEditing={onSearch}
            />
            {query.length > 0 && onClear && (
              <Pressable onPress={onClear} className="mr-3">
                <X size={18} color="#9ca3af" />
              </Pressable>
            )}
            <Pressable onPress={onSearch} className="ml-3">
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
        <Text className="text-gray-400 text-sm">{songsCount} songs</Text>
        {(isLoading || isFetching) && (
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-pink-400 rounded-full mr-2 animate-pulse" />
            <Text className="text-pink-400 text-sm">Loading...</Text>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
}
