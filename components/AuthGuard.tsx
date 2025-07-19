import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { usePathname, router } from "expo-router";
import { trpc } from "@/utils/trpc";

const PUBLIC_ROUTES = ["/login", "/landing", "/"]; // add '/' for index if it's public

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const pathname = usePathname();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading && !user && !isPublic) {
      router.replace("/login");
    }

    if (user && pathname === "/login") {
      router.replace("/home");
    }
  }, [isLoading, user, pathname]);

  if (!isPublic && (isLoading || !user)) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-base">Checking authentication...</Text>
      </View>
    );
  }

  return <>{children}</>;
}
