import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import playlistBUS from "../../backend/BUS/playlistBUS";

type Props = any;

export default function CreatePlayList({ uid }: Props) {
  const [colorBorder, setColorBorder] = useState("border-[#afafaf]");
  const [activeButton, setActiveButton] = useState(false);
  const [colorButton, setColorButton] = useState("bg-[#eaeaea] text-[#959595]");
  const [namePlaylists, setNamePlaylists] = useState("")

  useEffect(() => {
    setColorButton(
      activeButton ? "bg-blue-500 text-white" : "bg-[#eaeaea] text-[#959595]"
    );
  }, [activeButton]);

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
          <View className="p-5">
            <Text className="text-gray-500 text-sm">Tên danh sách phát</Text>
            <TextInput
              placeholder="Nhập tên danh sách phát"
              className={`text-lg border-b-2 ${colorBorder}`}
              onFocus={() => {
                setColorBorder("border-blue-500");
              }}
              onBlur={() => {
                setColorBorder("border-[#afafaf]");
              }}
              onChangeText={(text) => {
                setNamePlaylists(text)
                setActiveButton(text.length > 0);
              }}
              value={namePlaylists}
            />
          </View>
        </View>
        <View className="p-5">
          <Pressable
            onPress={() => {
              if (activeButton) {
                try{
                    playlistBUS.addPlaylist(uid, namePlaylists)
                    DeviceEventEmitter.emit("playlistStatus", "success");
                    router.back();
                }
                catch(e){
                    alert(e)
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
    </SafeAreaView>
  );
}
