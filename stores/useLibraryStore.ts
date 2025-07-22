import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../utils/axios";

export interface LikedSong {
  id: number;
  title: string;
  artist: string;
  duration: string;
  fileUrl: string;
  likedAt: string;
  isLiked: boolean;
}

export interface RecentSong {
  id: number;
  title: string;
  artist: string;
  duration: string;
  fileUrl: string;
  lastPlayed: string;
  playCount: number;
}

export interface MostPlayedSong {
  id: number;
  title: string;
  artist: string;
  duration: string;
  fileUrl: string;
  playCount: number;
  lastPlayed: string;
}

interface LibraryState {
  likedSongs: LikedSong[];
  recentSongs: RecentSong[];
  mostPlayedSongs: MostPlayedSong[];
  isLoading: boolean;

  // Actions
  fetchLikedSongs: () => Promise<void>;
  fetchRecentSongs: () => Promise<void>;
  fetchMostPlayedSongs: (timeframe?: string) => Promise<void>;
  toggleLike: (songId: number) => Promise<void>;
  trackPlay: (
    songId: number,
    duration: number,
    position: number
  ) => Promise<void>;

  // Helper methods
  isLiked: (songId: number) => boolean;
  addToRecent: (song: RecentSong) => void;
}

const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      likedSongs: [],
      recentSongs: [],
      mostPlayedSongs: [],
      isLoading: false,

      fetchLikedSongs: async () => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.get("/likes/songs");
          set({ likedSongs: response.data || [] });
        } catch (error) {
          console.error("Error fetching liked songs:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchRecentSongs: async () => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.get("/history/recent?limit=20");
          set({ recentSongs: response.data || [] });
        } catch (error) {
          console.error("Error fetching recent songs:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchMostPlayedSongs: async (timeframe = "month") => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.get(
            `/history/most-played?timeframe=${timeframe}&limit=20`
          );
          set({ mostPlayedSongs: response.data || [] });
        } catch (error) {
          console.error("Error fetching most played songs:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      toggleLike: async (songId: number) => {
        const { likedSongs } = get();
        const isCurrentlyLiked = likedSongs.some((song) => song.id === songId);

        try {
          if (isCurrentlyLiked) {
            await axiosInstance.delete(`/likes/songs/${songId}`);
            set({
              likedSongs: likedSongs.filter((song) => song.id !== songId),
            });
          } else {
            await axiosInstance.post(`/likes/songs/${songId}`);
            // Refetch to get updated data
            get().fetchLikedSongs();
          }
        } catch (error) {
          console.error("Error toggling like:", error);
        }
      },

      trackPlay: async (songId: number, duration: number, position: number) => {
        try {
          await axiosInstance.post("/history/track", {
            songId,
            duration,
            position,
          });
          // Optionally refresh recent songs
          get().fetchRecentSongs();
        } catch (error) {
          console.error("Error tracking play:", error);
        }
      },

      isLiked: (songId: number) => {
        const { likedSongs } = get();
        return likedSongs.some((song) => song.id === songId);
      },

      addToRecent: (song: RecentSong) => {
        const { recentSongs } = get();
        // Remove if already exists and add to front
        const filtered = recentSongs.filter((s) => s.id !== song.id);
        set({ recentSongs: [song, ...filtered].slice(0, 20) });
      },
    }),
    {
      name: "library-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        likedSongs: state.likedSongs,
        recentSongs: state.recentSongs,
        mostPlayedSongs: state.mostPlayedSongs,
      }),
    }
  )
);

export default useLibraryStore;
