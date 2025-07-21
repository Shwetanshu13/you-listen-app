// stores/useAudioStore.ts
import { create } from "zustand";

export const useAudioStore = create<{
  currentSong: {
    id: number;
    title: string;
    artist: string;
    duration: string;
    fileUrl: string;
  } | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  setCurrentSong: (song: {
    id: number;
    title: string;
    artist: string;
    duration: string;
    fileUrl: string;
  }) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setProgress: (progress: number) => void;
}>((set) => ({
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  progress: 0,
  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration: duration }),
  setProgress: (progress) => set({ progress: progress }),
}));
