import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
  id: number;
  username: string;
  role: string;
};

type AuthState = {
  appUser: User | null;
  setAppUser: (user: User) => void;
  clearAppUser: () => void;
};

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      appUser: null,
      setAppUser: (user) => set({ appUser: user }),
      clearAppUser: () => set({ appUser: null }),
    }),
    {
      name: "auth-storage", // key in storage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
