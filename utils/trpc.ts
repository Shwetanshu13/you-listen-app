// utils/trpc.ts (React Native)
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import type { AppRouter } from "../../../web app/apps/backend/src";

// For Expo: get from app config or hardcode temporarily
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

export const trpc = createTRPCReact<AppRouter>();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${BACKEND_URL}/trpc`,
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: "include", // only if cookies are used
        });
      },
    }),
  ],
});
