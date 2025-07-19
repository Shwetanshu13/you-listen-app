// app/(tabs)/profile.tsx
import { View } from "react-native";
import React from "react";
import ProfileCard from "@/components/ProfileCard";

const ProfilePage = () => {
  return (
    <View className="flex-1 bg-neutral-900 items-center justify-center p-4">
      <ProfileCard />
    </View>
  );
};

export default ProfilePage;
