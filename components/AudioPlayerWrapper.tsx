// components/AudioPlayerWrapper.tsx
import { useAudioStore } from "@/stores/useAudioStore";
import AudioPlayer from "./AudioPlayer";

export default function AudioPlayerWrapper() {
  const currentSong = useAudioStore((state) => state.currentSong);

  if (!currentSong) return null;

  return <AudioPlayer />;
}
