import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";

import Toast from "@/components/Toast";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "AlimamaFangYuanTiVF-Thin": require("../assets/fonts/AlimamaFangYuanTiVF-Thin.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
    }
  }, [loaded, error]);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <GluestackUIProvider mode="light">
          <Stack>
            <Stack.Screen name="advertise" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="index" />
          </Stack>
        </GluestackUIProvider>
        <Toast />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
