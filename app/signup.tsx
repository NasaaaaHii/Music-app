import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { ArrowLeft, Music } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignUp() {
  return (
    <SafeAreaView className="bg-purple-900">
      <View className="w-screen h-screen">
        <View className="w-full h-full flex-col justify-between items-center p-10">
          <View className="w-full flex flex-row justify-between items-center">
            <Pressable
              onPress={() => { router.push("/"); }}
              className="w-fit"
            >
              <ArrowLeft size={30} color={"#ffffff"} />
            </Pressable>
            <Text className="text-xl font-semibold text-white">Đăng ký</Text>
            <View className="w-fit"><ArrowLeft size={30} color={"rgba(255,255,255,0)"} /></View>
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
                <Text className="text-base text-white">Đăng ký bằng</Text>
              </View>
              <View className="flex-1 bg-white h-1 rounded-full">
                <Text></Text>
              </View>
            </View>
            <Pressable
              onPress={() => { router.push("/(tabs)/home"); }}
              className="bg-white w-[80%] flex flex-row gap-5 justify-center items-center rounded-full py-3 hover:bg-[#f0e5e5] active:bg-[#e5d6d6]"
            >
              <AntDesign name="google" size={24} color="black" />
              <Text className="text-base font-semibold">Google</Text>
            </Pressable>
            
            <View className="flex flex-row mt-3">
              <Text className="text-white">Bạn đã có tài khoản? </Text>
              <Pressable onPress={() => { router.push('/login') }}>
                <Text className="text-blue-300 font-semibold">Đăng nhập</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
