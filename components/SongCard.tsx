import { View, Text, Pressable } from "react-native";
import { Pause, Play } from "lucide-react-native";
import { useAudioStore } from "@/stores/useAudioStore";
import { cn } from "@/lib/utils";

type SongCardProps = {
  id: number;
  title: string;
  artist: string;
  duration: string;
  fileUrl: string;
};

export default function SongCard({
  id,
  title,
  artist,
  duration,
  fileUrl,
}: SongCardProps) {
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying } =
    useAudioStore();
  const isCurrent = currentSong?.id === id;

  const handlePlay = () => {
    if (isCurrent) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSong({ id, title, artist, duration, fileUrl });
      setIsPlaying(true);
    }
  };

  return (
    <Pressable
      className={cn(
        "flex-row justify-between items-center p-4 rounded-xl bg-neutral-800 my-1",
        isCurrent && "bg-pink-600"
      )}
      onPress={handlePlay}
    >
      <View>
        <Text className="text-white font-semibold">{title}</Text>
        <Text className="text-gray-400 text-sm">
          {artist || "Unknown Artist"}
        </Text>
      </View>
      <View className="flex-row items-center gap-4">
        <Text className="text-xs text-gray-300">{duration || "0:00"}</Text>
        {isCurrent && isPlaying ? (
          <Pause size={20} color="white" />
        ) : (
          <Play size={20} color="white" />
        )}
      </View>
    </Pressable>
  );
}
