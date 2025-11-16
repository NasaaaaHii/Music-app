import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import { Music } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  FIREBASE_AUTH,
  getError,
  onAuthStateChanged,
} from "../config/firebaseConfig";
import { t } from "./theme";

export default function Index() {
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const isWeb = Platform.OS === "web";
  const isTablet = dimensions.width >= 768;
  const isDesktop = dimensions.width >= 1024;
  const horizontalPadding = isWeb ? (isDesktop ? 120 : isTablet ? 72 : 32) : 24;
  const verticalPadding = isWeb ? (isDesktop ? 80 : isTablet ? 64 : 40) : 32;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  async function init() {
    try {
      setLoading(true);
      const f = await onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user && user.emailVerified) {
          setValid(true);
        }
        setLoading(false);
      });
      return f;
    } catch (e: any) {
      alert(getError(e.code));
    }
  }

  useEffect(() => {
    init();
  }, []);

  if (loading)
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: t.surface }}
      >
        <ActivityIndicator size={"large"} color={t.primary} />
      </View>
    );
  if (valid) return <Redirect href="/(tabs)/home" />;
  return (
    <LinearGradient
      colors={t.heroGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: horizontalPadding,
            paddingVertical: verticalPadding,
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View></View>
            <View
              className={`w-full flex-col justify-center items-center ${
                isWeb ? (isDesktop ? "gap-6" : "gap-4") : "gap-4"
              }`}
              style={
                isWeb && isDesktop ? { maxWidth: 700, alignSelf: "center" } : {}
              }
            >
              <LinearGradient
                colors={t.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className={`w-fit rounded-full ${
                  isWeb && isDesktop ? "p-8" : "p-6"
                }`}
                style={{
                  shadowColor: t.primary,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.5,
                  shadowRadius: 20,
                  elevation: 15,
                }}
              >
                <Music
                  size={isWeb && isDesktop ? 64 : 56}
                  color={t.surface}
                  strokeWidth={2.5}
                />
              </LinearGradient>
              <Text
                className={`font-bold mt-2 ${
                  isWeb && isDesktop ? "text-6xl" : "text-5xl"
                }`}
                style={{ color: t.text, letterSpacing: 1 }}
              >
                Music App
              </Text>
              <Text
                className={`font-normal mt-2 ${
                  isWeb && isDesktop ? "text-xl" : "text-lg"
                }`}
                style={{ color: t.textMuted, textAlign: "center" }}
              >
                Khám phá thế giới âm nhạc
              </Text>
            </View>
            <View
              className={`flex flex-col w-full justify-center items-center ${
                isWeb ? (isDesktop ? "gap-5" : "gap-4") : "gap-4"
              }`}
              style={
                isWeb && isDesktop ? { maxWidth: 500, alignSelf: "center" } : {}
              }
            >
              <Pressable
                onPress={() => {
                  router.push("/login");
                }}
                className={`${
                  isWeb
                    ? isDesktop
                      ? "w-full max-w-[500px]"
                      : isTablet
                        ? "w-[70%] max-w-[500px]"
                        : "w-[85%] max-w-[500px]"
                    : "w-[85%] max-w-[500px]"
                } flex justify-center items-center rounded-full ${
                  isWeb && isDesktop ? "py-5" : "py-4"
                } overflow-hidden`}
                style={{
                  shadowColor: t.primary,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.5,
                  shadowRadius: 16,
                  elevation: 12,
                }}
              >
                <LinearGradient
                  colors={t.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: "100%",
                    paddingVertical: isWeb && isDesktop ? 20 : 16,
                    borderRadius: 9999,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    className="text-base font-bold"
                    style={{ color: t.surface, letterSpacing: 0.8 }}
                  >
                    Đăng nhập
                  </Text>
                </LinearGradient>
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push("/signup");
                }}
                className={`${
                  isWeb
                    ? isDesktop
                      ? "w-full max-w-[500px]"
                      : isTablet
                        ? "w-[70%] max-w-[500px]"
                        : "w-[85%] max-w-[500px]"
                    : "w-[85%] max-w-[500px]"
                } flex justify-center items-center rounded-full ${
                  isWeb && isDesktop ? "py-5" : "py-4"
                }`}
                style={{
                  backgroundColor: t.cardBg,
                  borderWidth: 2.5,
                  borderColor: t.primary,
                  shadowColor: t.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                  elevation: 6,
                }}
              >
                <Text
                  className="text-base font-bold"
                  style={{ color: t.primary, letterSpacing: 0.8 }}
                >
                  Đăng ký
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
