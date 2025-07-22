import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "../utils/axios";

export interface Playlist {
  id: number;
  name: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  songCount: number;
  songs?: PlaylistSong[];
}

export interface PlaylistSong {
  id: number;
  title: string;
  artist: string;
  duration: string;
  fileUrl: string;
  addedAt: string;
}

export interface CreatePlaylistData {
  name: string;
  description: string;
  isPublic: boolean;
}

export interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  fileUrl: string;
}

interface PlaylistState {
  playlists: Playlist[];
  currentPlaylist: Playlist | null;
  allSongs: Song[];
  isLoading: boolean;

  // Actions
  fetchPlaylists: () => Promise<void>;
  fetchPlaylistById: (id: string) => Promise<Playlist | null>;
  createPlaylist: (data: CreatePlaylistData) => Promise<Playlist | null>;
  updatePlaylist: (
    id: string,
    data: Partial<CreatePlaylistData>
  ) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: number) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: number) => Promise<void>;
  fetchAllSongs: () => Promise<void>;
  setCurrentPlaylist: (playlist: Playlist | null) => void;

  // Helper methods
  getPlaylistById: (id: number) => Playlist | undefined;
}

const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      playlists: [],
      currentPlaylist: null,
      allSongs: [],
      isLoading: false,

      fetchPlaylists: async () => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.get("/playlists");
          set({ playlists: response.data || [] });
        } catch (error) {
          console.error("Error fetching playlists:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      fetchPlaylistById: async (id: string) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.get(`/playlists/${id}`);
          const playlist = response.data;

          // Update the playlist in the local state
          const { playlists } = get();
          const updatedPlaylists = playlists.map((p) =>
            p.id === parseInt(id) ? playlist : p
          );
          set({ playlists: updatedPlaylists, currentPlaylist: playlist });

          return playlist;
        } catch (error) {
          console.error("Error fetching playlist:", error);
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      createPlaylist: async (data: CreatePlaylistData) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.post("/playlists", data);
          const newPlaylist = response.data;

          const { playlists } = get();
          set({ playlists: [...playlists, newPlaylist] });

          return newPlaylist;
        } catch (error) {
          console.error("Error creating playlist:", error);
          return null;
        } finally {
          set({ isLoading: false });
        }
      },

      updatePlaylist: async (id: string, data: Partial<CreatePlaylistData>) => {
        set({ isLoading: true });
        try {
          const response = await axiosInstance.put(`/playlists/${id}`, data);
          const updatedPlaylist = response.data;

          const { playlists } = get();
          const updatedPlaylists = playlists.map((p) =>
            p.id === parseInt(id) ? { ...p, ...updatedPlaylist } : p
          );
          set({ playlists: updatedPlaylists });

          // Update current playlist if it's the one being updated
          const { currentPlaylist } = get();
          if (currentPlaylist?.id === parseInt(id)) {
            set({
              currentPlaylist: { ...currentPlaylist, ...updatedPlaylist },
            });
          }
        } catch (error) {
          console.error("Error updating playlist:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      deletePlaylist: async (id: string) => {
        set({ isLoading: true });
        try {
          await axiosInstance.delete(`/playlists/${id}`);

          const { playlists, currentPlaylist } = get();
          const updatedPlaylists = playlists.filter(
            (p) => p.id !== parseInt(id)
          );
          set({
            playlists: updatedPlaylists,
            currentPlaylist:
              currentPlaylist?.id === parseInt(id) ? null : currentPlaylist,
          });
        } catch (error) {
          console.error("Error deleting playlist:", error);
        } finally {
          set({ isLoading: false });
        }
      },

      addSongToPlaylist: async (playlistId: string, songId: number) => {
        try {
          await axiosInstance.post(`/playlists/${playlistId}/songs`, {
            songId,
          });

          // Refresh the specific playlist
          await get().fetchPlaylistById(playlistId);
        } catch (error) {
          console.error("Error adding song to playlist:", error);
        }
      },

      removeSongFromPlaylist: async (playlistId: string, songId: number) => {
        try {
          await axiosInstance.delete(
            `/playlists/${playlistId}/songs/${songId}`
          );

          // Refresh the specific playlist
          await get().fetchPlaylistById(playlistId);
        } catch (error) {
          console.error("Error removing song from playlist:", error);
        }
      },

      fetchAllSongs: async () => {
        try {
          const response = await axiosInstance.get("/songs");
          set({ allSongs: response.data || [] });
        } catch (error) {
          console.error("Error fetching all songs:", error);
        }
      },

      setCurrentPlaylist: (playlist: Playlist | null) => {
        set({ currentPlaylist: playlist });
      },

      getPlaylistById: (id: number) => {
        const { playlists } = get();
        return playlists.find((p) => p.id === id);
      },
    }),
    {
      name: "playlist-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        playlists: state.playlists,
        currentPlaylist: state.currentPlaylist,
      }),
    }
  )
);

export default usePlaylistStore;
