import { Redirect, router, useLocalSearchParams } from "expo-router";
import { Search, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, getError, onAuthStateChanged } from "../../../config/firebaseConfig";
import FavoriteMusicList from "../../Components/FavoriteMusicList";
import SearchMusicList from "../../Components/SearchMusicList";

export default function AddMusicPage() {
  const [activePage, setActivePage] = useState("online")
  const [content, setContent] = useState("")
  const params = useLocalSearchParams<any>();
  
  const [valid, setValid] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);

  async function init() {
    try {
      setLoadingPage(true);
      const f = await onAuthStateChanged(FIREBASE_AUTH, async (user) => {
        if (user && user.emailVerified) {
          setValid(user);
        }
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
          {activePage==="online" && <SearchMusicList searchContent={content} uid={FIREBASE_AUTH.currentUser?.uid!} plid={params.idPlaylists}/>}
          {activePage==="loved" && <FavoriteMusicList searchContent={content} uid={FIREBASE_AUTH.currentUser?.uid!} plid={params.idPlaylists}/>}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
