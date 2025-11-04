import { Checkbox } from "expo-checkbox";
import { Redirect, router } from "expo-router";
import { ArrowLeft, Music } from "lucide-react-native";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { sendEmailVerification } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  FIREBASE_AUTH,
  getError,
  onAuthStateChanged,
} from "../config/firebaseConfig";

export default function SignUp() {
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setChecked] = useState(false);

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
      <View className="flex-1 bg-purple-900 justify-center items-center">
        <ActivityIndicator size={"large"} color="white" />
      </View>
    );
  if (valid) return <Redirect href="/(tabs)/home" />;

  async function signUpFunction() {
    try{
      if(password !== confirmPassword) {
        alert("Mật khẩu không khớp nhau!")
        return
      }
      if(!isChecked){
        alert("Vui lòng chấp nhận thỏa thuận")
        return
      }
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user
      await sendEmailVerification(user)
      alert("Đăng ký tài khoản thành công!" + " Một email xác minh đã được gửi đến " + email + ". Vui lòng kiểm tra hộp thư để kích hoạt tài khoản.")
      router.push({
        pathname: "/login",
        params: {
          "emailSignUp": email,
          "passwordSignUp": password,
        }
      })
    }
    catch(e: any){
      alert(getError(e.code))
    }
  }

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
                Đăng ký
              </Text>
              <Text className="text-white font-light text-base mt-2">
                Chào mừng bạn đến với thế giới của Negav
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
                  onChangeText={(text) => {
                    setEmail(text);
                  }}
                />
              </View>

              <View className="w-[80%] max-w-[500px]">
                <Text className="w-full text-white text-base text-sm">
                  Mật khẩu
                </Text>
                <TextInput
                  className="outline-none border w-full border-red-300 text-white rounded-lg placeholder:text-gray-300 p-3"
                  placeholder="Nhập mật khẩu..."
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                  secureTextEntry={true}
                />
              </View>

              <View className="w-[80%] max-w-[500px]">
                <Text className="w-full text-white text-base text-sm">
                  Nhập lại mật khẩu
                </Text>
                <TextInput
                  className="outline-none border w-full border-red-300 text-white rounded-lg placeholder:text-gray-300 p-3"
                  placeholder="Nhập lại mật khẩu..."
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                  }}
                  secureTextEntry={true}
                />
              </View>

              <View className="w-[80%] max-w-[500px]">
                <View className="w-full flex items-center flex-row">
                  <Checkbox
                    value={isChecked}
                    onValueChange={setChecked}
                    style={{ width: 15, height: 15 }}
                  />
                  <Pressable
                    onPress={() => {
                      isChecked ? setChecked(false) : setChecked(true);
                    }}
                  >
                    <Text className="text-white text-sm">
                      {" "}
                      Bạn đồng ý với tất cả các{" "}
                    </Text>
                  </Pressable>
                  <Pressable>
                    <Text className="text-red-500 text-sm">điều khoản</Text>
                  </Pressable>
                </View>
              </View>

              <Pressable
                onPress={() => {
                  signUpFunction()
                }}
                className="bg-white w-[80%] max-w-[500px] flex flex-row gap-5 justify-center items-center rounded-full py-3 hover:bg-[#f0e5e5] active:bg-[#e5d6d6]"
              >
                <Text className="text-base font-semibold">Đăng ký</Text>
              </Pressable>

              <View className="flex flex-row mt-3">
                <Text className="text-white">Bạn đã có tài khoản? </Text>
                <Pressable
                  onPress={() => {
                    router.push("/login");
                  }}
                >
                  <Text className="text-blue-300 font-semibold">Đăng nhập</Text>
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
