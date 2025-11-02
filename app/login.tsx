import { AntDesign } from "@expo/vector-icons";
import * as Google from "expo-auth-session/providers/google";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { ArrowLeft, Music } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  // const redirectUri = 'exp://127.0.0.1:8081';

  const [useInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
  });

  useEffect(() => {
    console.log( process.env.EXPO_PUBLIC_CLIENT_ID )
    console.log( process.env.EXPO_PUBLIC_CLIENT_SECRET )
    console.log( process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID )
    console.log( process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET )
    console.log( process.env.EXPO_PUBLIC_BASE_URL )
    console.log( process.env.EXPO_PUBLIC_SCHEME )
    console.log( process.env.EXPO_PUBLIC_JWT_SECRET )
    console.log( process.env.EXPO_PUBLIC_JWT_REFRESH_SECRET )
    if (response?.type === "success") {
      const { authentication } = response;
      console.log("Access Token:", authentication?.accessToken);
    }
  }, [response]);

  return (
    <SafeAreaView className="bg-purple-900">
      <View className="w-screen h-screen">
        <View className="w-full h-full flex-col justify-between items-center p-10">
          <View className="w-full flex flex-row justify-between items-center">
            <Pressable
              onPress={() => {
                router.push("/");
              }}
              className="w-fit"
            >
              <ArrowLeft size={30} color={"#ffffff"} />
            </Pressable>
            <Text className="text-xl font-semibold text-white">Đăng nhập</Text>
            <View className="w-fit">
              <ArrowLeft size={30} color={"rgba(255,255,255,0)"} />
            </View>
          </View>
          <View className="w-full flex-col justify-center items-center">
            <View className="w-fit p-5 bg-[rgba(255,255,255,0.15)] rounded-full mt-3">
              <Music size={40} color={"#fff"} />
            </View>
            <Text className="text-white font-normal text-3xl mt-1">
              Music App
            </Text>
            <Text className="text-white font-light text-base mt-2">
              Khám phá thế giới âm nhạc
            </Text>
          </View>
          <View className="flex flex-col w-full justify-center items-center gap-3">
            <View className="flex-row w-full justify-center items-center gap-5">
              <View className="flex-1 bg-white h-1 rounded-full">
                <Text></Text>
              </View>
              <View className="flex justify-center items-center">
                <Text className="text-base text-white">Đăng nhập bằng</Text>
              </View>
              <View className="flex-1 bg-white h-1 rounded-full">
                <Text></Text>
              </View>
            </View>
            <Pressable
              onPress={() => {
                promptAsync({
                  // @ts-ignore
                  useProxy: true,
                  showInRecents: true,
                });
              }}
              className="bg-white w-[80%] flex flex-row gap-5 justify-center items-center rounded-full py-3 hover:bg-[#f0e5e5] active:bg-[#e5d6d6]"
            >
              <AntDesign name="google" size={24} color="black" />
              <Text className="text-base font-semibold">Google</Text>
            </Pressable>
            <View className="flex flex-row mt-3">
              <Text className="text-white">Bạn chưa có tài khoản? </Text>
              <Pressable
                onPress={() => {
                  router.push("/signup");
                }}
              >
                <Text className="text-blue-300 font-semibold">Đăng ký</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
