import { useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";

export const useAudioCache = () => {
  const [cachedSongs, setCachedSongs] = useState<Set<number>>(new Set());

  const getCachedFilePath = (songId: number) => {
    return `${FileSystem.cacheDirectory}song_${songId}.mp3`;
  };

  const checkIfCached = async (songId: number): Promise<boolean> => {
    try {
      const cachedPath = getCachedFilePath(songId);
      const fileInfo = await FileSystem.getInfoAsync(cachedPath);
      return fileInfo.exists;
    } catch {
      return false;
    }
  };

  const cacheSong = async (
    fileUrl: string,
    songId: number
  ): Promise<string> => {
    try {
      const cachedPath = getCachedFilePath(songId);

      const download = FileSystem.createDownloadResumable(
        fileUrl,
        cachedPath,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          console.log(`Caching song ${songId}: ${Math.round(progress * 100)}%`);
        }
      );

      const result = await download.downloadAsync();
      if (result) {
        setCachedSongs((prev) => new Set([...prev, songId]));
        return result.uri;
      }
    } catch (error) {
      console.error(`Failed to cache song ${songId}:`, error);
    }
    return fileUrl; // Fallback to streaming
  };

  const removeCachedSong = async (songId: number): Promise<void> => {
    try {
      const cachedPath = getCachedFilePath(songId);
      await FileSystem.deleteAsync(cachedPath);
      setCachedSongs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(songId);
        return newSet;
      });
    } catch (error) {
      console.error(`Failed to remove cached song ${songId}:`, error);
    }
  };

  const getCacheSize = async (): Promise<number> => {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) return 0;

      const files = await FileSystem.readDirectoryAsync(cacheDir);
      let totalSize = 0;

      for (const file of files) {
        if (file.startsWith("song_") && file.endsWith(".mp3")) {
          const fileInfo = await FileSystem.getInfoAsync(`${cacheDir}${file}`);
          if (fileInfo.exists && fileInfo.size) {
            totalSize += fileInfo.size;
          }
        }
      }

      return totalSize;
    } catch {
      return 0;
    }
  };

  const clearCache = async (): Promise<void> => {
    try {
      const cacheDir = FileSystem.cacheDirectory;
      if (!cacheDir) return;

      const files = await FileSystem.readDirectoryAsync(cacheDir);

      for (const file of files) {
        if (file.startsWith("song_") && file.endsWith(".mp3")) {
          await FileSystem.deleteAsync(`${cacheDir}${file}`);
        }
      }

      setCachedSongs(new Set());
    } catch (error) {
      console.error("Failed to clear cache:", error);
    }
  };

  // Initialize cached songs on mount
  useEffect(() => {
    const initializeCachedSongs = async () => {
      try {
        const cacheDir = FileSystem.cacheDirectory;
        if (!cacheDir) return;

        const files = await FileSystem.readDirectoryAsync(cacheDir);
        const songIds = files
          .filter((file) => file.startsWith("song_") && file.endsWith(".mp3"))
          .map((file) => {
            const match = file.match(/song_(\d+)\.mp3/);
            return match ? parseInt(match[1], 10) : null;
          })
          .filter((id): id is number => id !== null);

        setCachedSongs(new Set(songIds));
      } catch (error) {
        console.error("Failed to initialize cached songs:", error);
      }
    };

    initializeCachedSongs();
  }, []);

  return {
    cachedSongs,
    getCachedFilePath,
    checkIfCached,
    cacheSong,
    removeCachedSong,
    getCacheSize,
    clearCache,
  };
};
