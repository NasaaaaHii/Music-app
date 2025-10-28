import { Stack } from "expo-router";
import "react-native-reanimated";
import "./global.css";

export default function RootLayout() {
<<<<<<< HEAD
  return (
    <Stack initialRouteName="(tabs)" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" />
    </Stack>
  );
=======
  return <Stack screenOptions={{ headerShown: false }} >
    <Stack.Screen name="index" />
    <Stack.Screen name="modal" />
  </Stack>
>>>>>>> 16bab324c152aac380ad0aa834bc73c225450a16
}
