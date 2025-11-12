import { Stack } from "expo-router";
import "react-native-reanimated";
import { MusicProvider } from "./Context/MusicContext";
import "./global.css";

export default function RootLayout() {
  return (
    <MusicProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="AlbumPlaylist" />
        <Stack.Screen name="Player" />
      </Stack>
    </MusicProvider>
  );
}
