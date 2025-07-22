// stores/useAudioStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RepeatMode = "off" | "all" | "one";

export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  fileUrl: string;
}

interface AudioState {
  // Current playback state
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  seekToPosition: number | null;
  isLoading: boolean;

  // Queue management
  queue: Song[];
  currentIndex: number;
  repeatMode: RepeatMode;
  shuffleMode: boolean;
  originalQueue: Song[];

  // Actions
  setCurrentSong: (song: Song) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setProgress: (progress: number) => void;
  seekTo: (position: number) => void;
  clearSeek: () => void;
  setIsLoading: (loading: boolean) => void;

  // Queue actions
  setQueue: (songs: Song[], startIndex?: number) => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  playNext: () => Song | null;
  playPrevious: () => Song | null;

  // Mode actions
  setRepeatMode: (mode: RepeatMode) => void;
  toggleShuffle: () => void;

  // Helper methods
  hasNext: () => boolean;
  hasPrevious: () => boolean;
  getCurrentSongFromQueue: () => Song | null;
}

export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      // Current playback state
      currentSong: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      progress: 0,
      seekToPosition: null,
      isLoading: false,

      // Queue management
      queue: [],
      currentIndex: -1,
      repeatMode: "off",
      shuffleMode: false,
      originalQueue: [],

      setCurrentSong: (song) =>
        set({
          currentSong: song,
          isLoading: true,
          currentTime: 0,
          duration: 0,
          progress: 0,
        }),

      setIsPlaying: (playing) => set({ isPlaying: playing }),
      setCurrentTime: (time) => set({ currentTime: time }),
      setDuration: (duration) => set({ duration: duration }),
      setProgress: (progress) => set({ progress: progress }),
      seekTo: (position) => set({ seekToPosition: position }),
      clearSeek: () => set({ seekToPosition: null }),
      setIsLoading: (loading) => set({ isLoading: loading }),

      setQueue: (songs, startIndex = 0) => {
        set({
          queue: songs,
          currentIndex: startIndex,
          originalQueue: songs,
          currentSong: songs[startIndex] || null,
        });
      },

      addToQueue: (song) => {
        const { queue } = get();
        set({ queue: [...queue, song] });
      },

      removeFromQueue: (index) => {
        const { queue, currentIndex } = get();
        const newQueue = queue.filter((_, i) => i !== index);
        const newCurrentIndex =
          index < currentIndex ? currentIndex - 1 : currentIndex;
        set({
          queue: newQueue,
          currentIndex:
            newCurrentIndex >= newQueue.length
              ? newQueue.length - 1
              : newCurrentIndex,
        });
      },

      clearQueue: () => {
        set({
          queue: [],
          currentIndex: -1,
          originalQueue: [],
          currentSong: null,
        });
      },

      playNext: () => {
        const { queue, currentIndex, repeatMode } = get();

        if (queue.length === 0) return null;

        let nextIndex = currentIndex + 1;

        if (repeatMode === "one") {
          nextIndex = currentIndex; // Stay on same song
        } else if (nextIndex >= queue.length) {
          if (repeatMode === "all") {
            nextIndex = 0; // Loop back to beginning
          } else {
            return null; // End of queue
          }
        }

        const nextSong = queue[nextIndex];
        set({
          currentIndex: nextIndex,
          currentSong: nextSong,
        });

        return nextSong;
      },

      playPrevious: () => {
        const { queue, currentIndex, repeatMode } = get();

        if (queue.length === 0) return null;

        let prevIndex = currentIndex - 1;

        if (prevIndex < 0) {
          if (repeatMode === "all") {
            prevIndex = queue.length - 1; // Loop to end
          } else {
            return null; // Beginning of queue
          }
        }

        const prevSong = queue[prevIndex];
        set({
          currentIndex: prevIndex,
          currentSong: prevSong,
        });

        return prevSong;
      },

      setRepeatMode: (mode) => set({ repeatMode: mode }),

      toggleShuffle: () => {
        const { shuffleMode, queue, originalQueue, currentSong } = get();

        if (!shuffleMode) {
          // Enable shuffle
          const shuffled = [...queue].sort(() => Math.random() - 0.5);
          const currentIndex = shuffled.findIndex(
            (song) => song.id === currentSong?.id
          );
          set({
            shuffleMode: true,
            queue: shuffled,
            currentIndex: currentIndex !== -1 ? currentIndex : 0,
          });
        } else {
          // Disable shuffle
          const currentIndex = originalQueue.findIndex(
            (song) => song.id === currentSong?.id
          );
          set({
            shuffleMode: false,
            queue: originalQueue,
            currentIndex: currentIndex !== -1 ? currentIndex : 0,
          });
        }
      },

      hasNext: () => {
        const { queue, currentIndex, repeatMode } = get();
        if (repeatMode === "all" || repeatMode === "one") return true;
        return currentIndex < queue.length - 1;
      },

      hasPrevious: () => {
        const { queue, currentIndex, repeatMode } = get();
        if (repeatMode === "all") return true;
        return currentIndex > 0;
      },

      getCurrentSongFromQueue: () => {
        const { queue, currentIndex } = get();
        return queue[currentIndex] || null;
      },
    }),
    {
      name: "audio-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        repeatMode: state.repeatMode,
        shuffleMode: state.shuffleMode,
        queue: state.queue,
        currentIndex: state.currentIndex,
        originalQueue: state.originalQueue,
      }),
    }
  )
);
