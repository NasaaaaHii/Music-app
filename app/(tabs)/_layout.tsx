import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { House, Library, Search, UserRound } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import MiniPlayerSong from "../Components/MiniPlayerSong";
import { t } from "../theme";

export default function _layout() {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const isWeb = Platform.OS === "web";
  const isTablet = dimensions.width >= 768;
  const isDesktop = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const tabHorizontalPadding = isWeb
    ? isDesktop
      ? 120
      : isTablet
        ? 72
        : 32
    : 0;

  const tabBarWidth = dimensions.width - tabHorizontalPadding * 2;

  const tabBarHeight = isWeb && isDesktop ? 50 : 48;
  const tabBarBottom = Platform.OS === "ios" ? 10 : 0;
  const miniPlayerBottom = tabBarHeight + tabBarBottom + 12;

  return (
    <View className="flex-1" style={{ backgroundColor: t.surface }}>
      <View style={{ flex: 1 }}>
        <Tabs
          initialRouteName="home"
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
              position: "absolute",
              bottom: tabBarBottom,
              height: tabBarHeight,
              left: tabHorizontalPadding,
              width: tabBarWidth,
              borderRadius: isWeb ? 30 : 24,
              borderTopWidth: 0,
              elevation: 5,
              shadowColor: t.primary,
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
                colors={[t.cardBg, t.tabBarBg]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  borderRadius: 35,
                  opacity: 0.95,
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
                  className={`rounded-full ${focused ? "p-2" : "bg-transparent"}`}
                  style={
                    focused
                      ? {
                          backgroundColor: t.primary,
                          shadowColor: t.primary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.4,
                          shadowRadius: 6,
                          elevation: 4,
                        }
                      : {}
                  }
                >
                  <House size={24} color={focused ? t.surface : t.textMuted} />
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="search"
            options={{
              tabBarIcon: ({ focused }) => (
                <View
                  className={`rounded-full ${focused ? "p-2" : "bg-transparent"}`}
                  style={
                    focused
                      ? {
                          backgroundColor: t.primary,
                          shadowColor: t.primary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.4,
                          shadowRadius: 6,
                          elevation: 4,
                        }
                      : {}
                  }
                >
                  <Search size={24} color={focused ? t.surface : t.textMuted} />
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="library"
            options={{
              tabBarIcon: ({ focused }) => (
                <View
                  className={`rounded-full ${focused ? "p-2" : "bg-transparent"}`}
                  style={
                    focused
                      ? {
                          backgroundColor: t.primary,
                          shadowColor: t.primary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.4,
                          shadowRadius: 6,
                          elevation: 4,
                        }
                      : {}
                  }
                >
                  <Library
                    size={24}
                    color={focused ? t.surface : t.textMuted}
                  />
                </View>
              ),
            }}
          />

          <Tabs.Screen
            name="setting"
            options={{
              tabBarIcon: ({ focused }) => (
                <View
                  className={`rounded-full ${focused ? "p-2" : "bg-transparent"}`}
                  style={
                    focused
                      ? {
                          backgroundColor: t.primary,
                          shadowColor: t.primary,
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.4,
                          shadowRadius: 6,
                          elevation: 4,
                        }
                      : {}
                  }
                >
                  <UserRound
                    size={24}
                    color={focused ? t.surface : t.textMuted}
                  />
                </View>
              ),
            }}
          />
        </Tabs>
      </View>
      <View
        style={{
          position: "absolute",
          left: tabHorizontalPadding,
          right: tabHorizontalPadding,
          bottom: miniPlayerBottom,
        }}
      >
        <MiniPlayerSong />
      </View>
    </View>
  );
}
