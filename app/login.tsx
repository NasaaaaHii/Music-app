import { Redirect, router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Music } from "lucide-react-native";
import { useEffect, useState } from "react";

import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { FIREBASE_AUTH, getError, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword } from "../config/firebaseConfig";

export default function Login() {
  const [valid, setValid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { emailSignUp, passwordSignUp } = useLocalSearchParams(); 

  async function init() {
    try{
      setLoading(true)
      const f = await onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user && user.emailVerified){
          setValid(true)
        }
        setLoading(false)
      });
      return f
    }
    catch(e: any){
      alert(getError(e.code))
    }
  }

  useEffect(() => {
    if(emailSignUp) setEmail(String(emailSignUp))
    if(passwordSignUp) setPassword(String(passwordSignUp))
    init()
  }, []);

  async function signInFunction(email: string, password: string) {
    try{
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
      await onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user){
          if(!user.emailVerified){
            alert("Email chưa được xác minh!")
          }
          else setValid(true)
        }
      });
    }
    catch(e: any){
      alert(getError(e.code))
    }
  }

  async function resetPasswordFunction(email: string) {
    try{
      await sendPasswordResetEmail(FIREBASE_AUTH, email)
      alert("Đã gửi email đặt lại mật khẩu")
    }
    catch(e: any){
      alert(getError(e.code))
    }
  }


  if(loading) return <View className="flex-1 bg-purple-900 justify-center items-center"><ActivityIndicator size={"large"} color="white" /></View>
  if(valid) return <Redirect href="/(tabs)/home" />;


  return (
    <SafeAreaView className="bg-purple-900">
      <View className="w-screen h-screen">
        <View className="w-full h-full flex-col justify-between items-center p-10">
          {/* Section 1 -- hidden */}
          <View className="w-full flex flex-row justify-between items-center">
            <Pressable
              onPress={() => {
                router.push("/");
              }}
              className="w-fit"
            >
              <ArrowLeft size={30} color={"#ffffff"} />
            </Pressable>
            <View className="w-fit">
              <ArrowLeft size={30} color={"rgba(255,255,255,0)"} />
            </View>
          </View>

          <View className="w-full flex-col justify-center items-center gap-5">
            {/* Header */}
            <View className="w-full flex-col justify-center items-center gap-1">
              <View className="w-fit p-5 bg-[rgba(255,255,255,0.15)] rounded-full">
                <Music size={40} color={"#fff"} />
              </View>
              <Text className="text-white font-normal text-3xl mt-1">
                Đăng nhập
              </Text>
              <Text className="text-white font-light text-base mt-2">
                Chào mừng bạn đến với thế giới âm nhạc
              </Text>
            </View>

            <View className="flex flex-col w-full justify-center items-center gap-3">
              <View className="w-[80%] max-w-[500px]">
                <Text className="w-full text-white text-base text-sm">
                  Email
                </Text>
                <TextInput
                  className="outline-none border w-full border-red-300 text-white rounded-lg placeholder:text-gray-300 p-3"
                  placeholder="Nhập email..."
                  value={email}
                  onChangeText={(text) => { setEmail(text) }}
                />
              </View>

              
              <View className="w-[80%] max-w-[500px]">
                <Text className="w-full text-white text-base text-sm">
                  Mật khẩu
                </Text>
                <TextInput
                  className="outline-none border w-full border-red-300 text-white rounded-lg placeholder:text-gray-300 p-3"
                  placeholder="Nhập mật khẩu..."
                  onChangeText={(text) => { setPassword(text) }}
                  value={password}
                  secureTextEntry={true}
                />
              </View>

              <View className="w-[80%] max-w-[500px]">
                <View className="w-full flex justify-end items-center flex-row">
                  <Pressable onPress={() => {
                    resetPasswordFunction(email)
                  }}>
                    <Text className="text-blue-200">Quên mật khẩu?</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                onPress={() => { signInFunction(email, password) }}
                className="bg-white w-[80%] max-w-[500px] flex flex-row gap-5 justify-center items-center rounded-full py-3 hover:bg-[#f0e5e5] active:bg-[#e5d6d6]"
              >
                <Text className="text-base font-semibold">Đăng nhập</Text>
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

          {/* Section 3 -- hidden */}
          <View className="w-full flex flex-row justify-between items-center">
            <View className="w-fit">
              <ArrowLeft size={30} color={"rgba(255,255,255,0)"} />
            </View>
            <View className="w-fit">
              <ArrowLeft size={30} color={"rgba(255,255,255,0)"} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
