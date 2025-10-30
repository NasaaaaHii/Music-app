import { router } from "expo-router";
import { Search, X } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FavoriteMusicList from "../../Components/FavoriteMusicList";
import SearchMusicList from "../../Components/SearchMusicList";

export default function AddMusicPage() {
  const [activePage, setActivePage] = useState("online")
  const [content, setContent] = useState("")

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex flex-row justify-between items-center p-3">
        <X size={25} strokeWidth={1.75} color={"rgba(0,0,0,0)"} />
        <Text className="font-semibold text-lg">Thêm bài hát</Text>
        <Pressable
          onPress={() => {
            router.back();
          }}
        >
          <X size={25} strokeWidth={1.75} />
        </Pressable>
      </View>

      <View className="flex justify-center items-center ">
        <View className="w-[90%] relative">
          <TextInput
            placeholder="Tìm kiếm bài hát, nghệ sĩ"
            className="bg-[#f0eff4] text-[#565558] rounded-full w-full pl-10 pr-5 py-3 outline-0 z-0"
            onChangeText={(value) => { setContent(value) }}
          />
          <View className="absolute top-[50%] -translate-y-1/2 left-3">
            <Search size={20} strokeWidth={1.5} color={"#565558"}/>
          </View>
        </View>
      </View>

      <View className="flex flex-row justify-between items-center py-2">
        <Pressable className="flex-1 items-center" onPress={() => setActivePage("online")}>
          <Text className={`${activePage==="online" ? "text-black": "text-gray-500"} text-sm font-semibold text-center`}>Online</Text>
          {activePage==="online" && <View className="bg-[#854ae7] w-10 rounded-full h-1"></View>}
        </Pressable>
        <Pressable className="flex-1 items-center" onPress={() => setActivePage("loved")}>
          <Text className={`${activePage==="loved" ? "text-black": "text-gray-500"} text-sm font-semibold text-center`}>Đã thích</Text>
          {activePage==="loved" && <View className="bg-[#854ae7] w-10 rounded-full h-1"></View>}
        </Pressable>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex mt-2 mb-80">
          {activePage==="online" && <SearchMusicList searchContent={content}/>}
          {activePage==="loved" && <FavoriteMusicList />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
