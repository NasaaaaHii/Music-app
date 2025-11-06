import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { House, Library, Search, UserRound } from "lucide-react-native";
import { StyleSheet, View } from "react-native";
import { t } from "../theme";

export default function _layout() {
  return (
    <View className="flex-1" style={{ backgroundColor: t.surface }}>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 20,
            height: 40,
            width: 350,
            borderRadius: 35,
            borderTopWidth: 0,
            elevation: 5,
            shadowColor: "#00ff99",
            shadowOpacity: 0.15,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 12,
            overflow: "hidden",
            backgroundColor: "transparent",
            alignSelf: "center",
            alignItems: "center",
          },
          tabBarBackground: () => (
            <LinearGradient
              colors={[
                "rgba(60, 60, 60, 0.95)", // trên
                "rgba(25, 25, 25, 0.95)", // giữa
                "rgba(10, 10, 10, 0.95)", // dưới
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{
                ...StyleSheet.absoluteFillObject,
                borderRadius: 35,
              }}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                className={`rounded-full ${focused ? "bg-[#C7E845] p-2" : "bg-transparent"}`}
              >
                <House size={24} color={focused ? "#1A1A1A" : "#B0B0B0"} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                className={`rounded-full ${focused ? "bg-[#C7E845] p-2" : "bg-transparent"}`}
              >
                <Search size={24} color={focused ? "#1A1A1A" : "#B0B0B0"} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="library"
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                className={`rounded-full ${focused ? "bg-[#C7E845] p-2" : "bg-transparent"}`}
              >
                <Library size={24} color={focused ? "#1A1A1A" : "#B0B0B0"} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="setting"
          options={{
            tabBarIcon: ({ focused }) => (
              <View
                className={`rounded-full ${focused ? "bg-[#C7E845] p-2" : "bg-transparent"}`}
              >
                <UserRound size={24} color={focused ? "#1A1A1A" : "#B0B0B0"} />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
