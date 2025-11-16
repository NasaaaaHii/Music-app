import { Checkbox } from "expo-checkbox";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import { ArrowLeft, Music } from "lucide-react-native";
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

import { useEffect, useState } from "react";
import userBUS from "../backend/BUS/userBUS";
import {
  createUserWithEmailAndPassword,
  FIREBASE_AUTH,
  getError,
  onAuthStateChanged,
  sendEmailVerification,
} from "../config/firebaseConfig";
import { t } from "./theme";

export default function SignUp() {
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setChecked] = useState(false);
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
        if (user && user.emailVerified) setValid(true);
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

  async function signUpFunction() {
    try {
      if (password !== confirmPassword) {
        alert("Mật khẩu không khớp nhau!");
        return;
      }
      if (!isChecked) {
        alert("Vui lòng chấp nhận thỏa thuận");
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);
      await userBUS.addUser(user.email!, user.uid);
      alert(
        "Đăng ký tài khoản thành công!" +
          " Một email xác minh đã được gửi đến " +
          email +
          ". Vui lòng kiểm tra hộp thư để kích hoạt tài khoản."
      );
      router.push({
        pathname: "/login",
        params: {
          emailSignUp: email,
          passwordSignUp: password,
        },
      });
    } catch (e: any) {
      alert(getError(e.code));
    }
  }

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
                  Đăng ký
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
                  <Text
                    className="w-full text-sm mb-2 font-semibold"
                    style={{ color: t.text }}
                  >
                    Nhập lại mật khẩu
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
                    placeholder="Nhập lại mật khẩu..."
                    placeholderTextColor={t.textMuted}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                    }}
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
                  <View className="w-full flex items-center flex-row gap-2">
                    <Checkbox
                      value={isChecked}
                      onValueChange={setChecked}
                      style={{ width: 18, height: 18 }}
                      color={t.primary}
                    />
                    <Pressable
                      onPress={() => {
                        isChecked ? setChecked(false) : setChecked(true);
                      }}
                      className="flex-1 flex-row flex-wrap"
                    >
                      <Text className="text-sm" style={{ color: t.textMuted }}>
                        Bạn đồng ý với tất cả các{" "}
                      </Text>
                      <Text
                        className="text-sm font-semibold"
                        style={{ color: t.primary }}
                      >
                        điều khoản
                      </Text>
                    </Pressable>
                  </View>
                </View>

                <Pressable
                  onPress={() => {
                    signUpFunction();
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
                      Đăng ký
                    </Text>
                  </LinearGradient>
                </Pressable>

                <View className="flex flex-row mt-4">
                  <Text className="text-sm" style={{ color: t.textMuted }}>
                    Bạn đã có tài khoản?{" "}
                  </Text>
                  <Pressable
                    onPress={() => {
                      router.push("/login");
                    }}
                  >
                    <Text
                      className="text-sm font-bold"
                      style={{ color: t.primary }}
                    >
                      Đăng nhập
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
