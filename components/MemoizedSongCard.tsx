import React from "react";
import SongCard from "./SongCard";

interface MemoizedSongCardProps {
  id: number;
  title: string;
  artist: string;
  duration: string;
  fileUrl: string;
}

// Memoized component to prevent unnecessary re-renders in FlatList
const MemoizedSongCard = React.memo(function MemoizedSongCard({
  id,
  title,
  artist,
  duration,
  fileUrl,
}: MemoizedSongCardProps) {
  return (
    <SongCard
      id={id}
      title={title}
      artist={artist}
      duration={duration}
      fileUrl={fileUrl}
    />
  );
});

export default MemoizedSongCard;
