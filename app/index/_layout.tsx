import { Feather, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import MiniPlayerSong from "../Components/MiniPlayerSong";
export default function _layout() {
  return (
<<<<<<< HEAD:app/(tabs)/_layout.tsx
    <View className="flex-1">
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#00bc7d",
          tabBarInactiveTintColor: "#4a5565",
          tabBarStyle: {
            height: 56.5,
            backgroundColor: "#f4f3f8",
          },
=======
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#00bc7d",
        tabBarInactiveTintColor: "#4a5565",
        tabBarStyle: {
          height: 55,
          backgroundColor: '#f4f3f8'
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ size, color }) => (
            <Feather name="home" size={24} color={color} />
          ),
>>>>>>> 16bab324c152aac380ad0aa834bc73c225450a16:app/index/_layout.tsx
        }}
        initialRouteName="home"
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ size, color }) => (
              <Feather name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: "Tìm kiếm",
            tabBarIcon: ({ color }) => (
              <Feather name="search" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Thư viện",
            tabBarIcon: ({ color }) => (
              <Ionicons name="library-outline" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
      <View className="absolute bottom-6 left-0 right-0 px-4">
        <MiniPlayerSong />
      </View>
    </View>
  );
}
