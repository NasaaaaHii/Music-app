import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }} >
    <Stack.Screen name="(tabs)" />
    <Stack.Screen name="modal" />
  </Stack>
}
