import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Music } from "lucide-react-native";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  FIREBASE_AUTH,
  getError,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "../config/firebaseConfig";
import { t } from "./theme";

export default function Login() {
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { emailSignUp, passwordSignUp } = useLocalSearchParams();
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
    if (emailSignUp) setEmail(String(emailSignUp));
    if (passwordSignUp) setPassword(String(passwordSignUp));
    init();
  }, []);

  async function signInFunction(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      await onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user) {
          if (!user.emailVerified) {
            alert("Email chưa được xác minh!");
          } else setValid(true);
        }
      });
    } catch (e: any) {
      alert(getError(e.code));
    }
  }

  async function resetPasswordFunction(email: string) {
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      alert("Đã gửi email đặt lại mật khẩu");
    } catch (e: any) {
      alert(getError(e.code));
    }
  }

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
          className="w-screen h-screen"
          style={{ backgroundColor: "transparent" }}
        >
          <View
            className={`w-full h-full flex-col justify-between items-center ${
              isWeb ? (isDesktop ? "p-20" : isTablet ? "p-16" : "p-10") : "p-10"
            }`}
          >
            <View className="w-full flex flex-row justify-between items-center">
              <Pressable
                onPress={() => {
                  router.push("/");
                }}
                className="w-fit"
              >
                <ArrowLeft size={30} color={t.text} />
              </Pressable>
              <View className="w-fit">
                <ArrowLeft size={30} color={"transparent"} />
              </View>
            </View>

            <View
              className={`w-full flex-col justify-center items-center ${
                isWeb ? (isDesktop ? "gap-8" : "gap-6") : "gap-6"
              }`}
              style={
                isWeb && isDesktop ? { maxWidth: 600, alignSelf: "center" } : {}
              }
            >
              <View className="w-full flex-col justify-center items-center gap-4">
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
                    shadowOpacity: 0.4,
                    shadowRadius: 16,
                    elevation: 12,
                  }}
                >
                  <Music
                    size={isWeb && isDesktop ? 56 : 48}
                    color={t.surface}
                    strokeWidth={2.5}
                  />
                </LinearGradient>
                <Text
                  className={`font-bold mt-2 ${
                    isWeb && isDesktop ? "text-5xl" : "text-4xl"
                  }`}
                  style={{ color: t.text, letterSpacing: 0.5 }}
                >
                  Đăng nhập
                </Text>
                <Text
                  className={`font-normal mt-1 ${
                    isWeb && isDesktop ? "text-lg" : "text-base"
                  }`}
                  style={{ color: t.textMuted, textAlign: "center" }}
                >
                  Chào mừng bạn đến với thế giới âm nhạc
                </Text>
              </View>

              <View
                className={`flex flex-col w-full justify-center items-center ${
                  isWeb ? "gap-5" : "gap-4"
                }`}
              >
                <View
                  className={`${
                    isWeb
                      ? isDesktop
                        ? "w-full max-w-[500px]"
                        : isTablet
                          ? "w-[70%] max-w-[500px]"
                          : "w-[85%] max-w-[500px]"
                      : "w-[85%] max-w-[500px]"
                  }`}
                >
                  <Text
                    className="w-full text-sm mb-2 font-semibold"
                    style={{ color: t.text }}
                  >
                    Email
                  </Text>
                  <TextInput
                    className="w-full rounded-2xl px-5 py-4"
                    style={{
                      borderWidth: 2,
                      borderColor: t.tabBarBorder,
                      backgroundColor: t.cardBg,
                      color: t.text,
                      fontSize: 16,
                      shadowColor: t.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                    placeholder="Nhập email..."
                    placeholderTextColor={t.textMuted}
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                    }}
                  />
                </View>

                <View
                  className={`${
                    isWeb
                      ? isDesktop
                        ? "w-full max-w-[500px]"
                        : isTablet
                          ? "w-[70%] max-w-[500px]"
                          : "w-[85%] max-w-[500px]"
                      : "w-[85%] max-w-[500px]"
                  }`}
                >
                  <Text
                    className="w-full text-sm mb-2 font-semibold"
                    style={{ color: t.text }}
                  >
                    Mật khẩu
                  </Text>
                  <TextInput
                    className="w-full rounded-2xl px-5 py-4"
                    style={{
                      borderWidth: 2,
                      borderColor: t.tabBarBorder,
                      backgroundColor: t.cardBg,
                      color: t.text,
                      fontSize: 16,
                      shadowColor: t.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.15,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                    placeholder="Nhập mật khẩu..."
                    placeholderTextColor={t.textMuted}
                    onChangeText={(text) => {
                      setPassword(text);
                    }}
                    value={password}
                    secureTextEntry={true}
                  />
                </View>

                <View
                  className={`${
                    isWeb
                      ? isDesktop
                        ? "w-full max-w-[500px]"
                        : isTablet
                          ? "w-[70%] max-w-[500px]"
                          : "w-[85%] max-w-[500px]"
                      : "w-[85%] max-w-[500px]"
                  }`}
                >
                  <View className="w-full flex justify-end items-center flex-row">
                    <Pressable
                      onPress={() => {
                        resetPasswordFunction(email);
                      }}
                    >
                      <Text
                        className="text-sm font-medium"
                        style={{ color: t.primary }}
                      >
                        Quên mật khẩu?
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  onPress={() => {
                    signInFunction(email, password);
                  }}
                  className={`${
                    isWeb
                      ? isDesktop
                        ? "w-full max-w-[500px]"
                        : isTablet
                          ? "w-[70%] max-w-[500px]"
                          : "w-[85%] max-w-[500px]"
                      : "w-[85%] max-w-[500px]"
                  } flex flex-row gap-5 justify-center items-center rounded-full ${
                    isWeb && isDesktop ? "py-5" : "py-4"
                  } mt-2 overflow-hidden`}
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

                <View className="flex flex-row mt-4">
                  <Text className="text-sm" style={{ color: t.textMuted }}>
                    Bạn chưa có tài khoản?{" "}
                  </Text>
                  <Pressable
                    onPress={() => {
                      router.push("/signup");
                    }}
                  >
                    <Text
                      className="text-sm font-bold"
                      style={{ color: t.primary }}
                    >
                      Đăng ký
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>

            <View className="w-full flex flex-row justify-between items-center">
              <View className="w-fit">
                <ArrowLeft size={30} color={"transparent"} />
              </View>
              <View className="w-fit">
                <ArrowLeft size={30} color={"transparent"} />
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
