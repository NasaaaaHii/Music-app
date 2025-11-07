import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import playlistBUS from "../../backend/BUS/playlistBUS";
import {
  FIREBASE_AUTH,
  getError,
  onAuthStateChanged,
} from "../../config/firebaseConfig";

export default function CreatePlayList() {
  const [colorBorder, setColorBorder] = useState("border-[#afafaf]");
  const [activeButton, setActiveButton] = useState(false);
  const [colorButton, setColorButton] = useState("bg-[#eaeaea] text-[#959595]");
  const [namePlaylists, setNamePlaylists] = useState("");
  const [valid, setValid] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    setColorButton(
      activeButton ? "bg-blue-500 text-white" : "bg-[#eaeaea] text-[#959595]"
    );
  }, [activeButton]);

  async function init() {
    try {
      setLoadingPage(true);
      const f = await onAuthStateChanged(FIREBASE_AUTH, async (user) => {
        if (user && user.emailVerified) setValid(user);
        setLoadingPage(false);
      });
      return f;
    } catch (e: any) {
      alert(getError(e.code));
    }
  }

  useEffect(() => {
    init();
  }, []);

  if (loadingPage)
    return (
      <View className="flex-1 bg-purple-900 justify-center items-center">
        <ActivityIndicator size={"large"} color="white" />
      </View>
    );
  if (!valid) return <Redirect href="/" />;

  return (
    <SafeAreaView className="flex bg-[#f4f3f8]">
      <View className="w-full h-full flex flex-col">
        <View className="w-full">
          <View className="flex flex-row justify-between mb-5">
            <View className="w-fit">
              <Ionicons
                name="close-outline"
                size={30}
                color={"rgba(255,255,255,0)"}
                className="p-4"
              />
            </View>
            <View className="flex flex-row justify-center items-center h-full">
              <Text className="text-xl font-semibold">Tạo danh sách phát</Text>
            </View>
            <Pressable onPress={() => router.back()} className="w-fit">
              <Ionicons
                name="close-outline"
                size={30}
                color="#1c1c1c"
                className="p-4"
              />
            </Pressable>
          </View>
          <View className="p-5 flex justify-center items-center w-full">
            <Text className="text-gray-500 text-sm w-[90%] max-w-[900px]">
              Tên danh sách phát
            </Text>
            <TextInput
              placeholder="Nhập tên danh sách phát"
              className={`text-lg border-b-2 ${colorBorder} outline-none w-[90%] max-w-[900px]`}
              onFocus={() => {
                setColorBorder("border-blue-500");
              }}
              onBlur={() => {
                setColorBorder("border-[#afafaf]");
              }}
              onChangeText={(text) => {
                setNamePlaylists(text);
                setActiveButton(text.length > 0);
              }}
              value={namePlaylists}
            />
          </View>
        </View>
        <View className="p-5 flex justify-center items-center">
          <View className="w-[90%] max-w-[900px]">
            <Pressable
              onPress={() => {
                if (activeButton) {
                  try {
                    playlistBUS.addPlaylist(FIREBASE_AUTH.currentUser!.uid as string, namePlaylists);
                    DeviceEventEmitter.emit("playlistStatus", "success");
                    router.back();
                  } catch (e) {
                    alert(e);
                  }
                }
              }}
            >
              <Text
                className={`${colorButton} w-full text-center p-3 text-lg font-semibold rounded-3xl`}
              >
                Tạo danh sách phát
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
