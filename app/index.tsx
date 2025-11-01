import { Redirect, router } from "expo-router";
import { Music } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [isLogin, setIslogin] = useState(false);

  {
    if (isLogin) return <Redirect href="/(tabs)/home" />;
    return (
      <SafeAreaView className="bg-purple-900">
        <View className="w-screen h-screen">
          <View className="w-full h-full flex-col justify-between items-center p-10">
            <View></View>
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
              <Pressable
                onPress={() => {
                  router.push("/login");
                }}
                className="bg-white w-[80%] flex justify-center items-center rounded-full py-3 hover:bg-[#f0e5e5] active:bg-[#e5d6d6]"
              >
                <Text className="text-base font-semibold">Đăng nhập</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push("/signup");
                }}
                className="bg-white w-[80%] flex justify-center items-center rounded-full py-3 hover:bg-[#f0e5e5] active:bg-[#e5d6d6]"
              >
                <Text className="text-base font-semibold">Đăng ký</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
