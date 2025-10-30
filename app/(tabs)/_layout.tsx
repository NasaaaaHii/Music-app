import { Feather, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
export default function _layout() {
  return (
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
      {/* <View className="absolute bottom-6 left-0 right-0 px-4">
        <MiniPlayerSong />
      </View> */}
    </View>
  );
}
