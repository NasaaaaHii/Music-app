import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { CircleArrowDown, CirclePlus } from 'lucide-react-native';
import { useEffect, useState } from "react";
import { Image, ImageProps, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchAPITracks } from "../../../src/api/spotify";

export default function PlayLists() {
  const params = useLocalSearchParams();

  const [iconHeader, setIconHeader] = useState<React.ReactNode>(null);
  const [colorPlayer, setColorPlayer] = useState("bg-gray-300")
  const [loading, setLoading] = useState(false)
  const [tracks, setTracks] = useState(null)

  useEffect(() => {
    (params.count == '0' ? setColorPlayer("bg-gray-300") : setColorPlayer("bg-[#8546ec]"))
  }, [params.count])

  useEffect(() => {
    if (params.type === "category") {
      setIconHeader(
        <View className="flex flex-row justify-center items-center bg-[#f0eff4] rounded-xl">
          <Feather
            name={params.icon as keyof typeof Feather.glyphMap}
            size={100}
            color={"#d0cfd5"}
            className="aspect-square p-28"
          />
        </View>
      );
    }
    else if (params.type === "playlists") {
      if (params.firstMusic == null) {
        setIconHeader(
          <View className="flex flex-row justify-center items-center bg-[#f0eff4] rounded-xl">
            <Feather
              name="music"
              size={100}
              color={"#d0cfd5"}
              className="aspect-square p-28"
            />
          </View>
        )
      }
      else {
        setIconHeader(
          <View className="flex px-20 flex-row justify-center items-center">
            <Image
              source={params.firstMusic as ImageProps}
              className="aspect-square w-full rounded-xl"
            />
          </View>
        )
      }
    }
  }, []);

  async function LoadSearch(title: string, limit: number){
    setLoading(true)
  
    const data = await SearchAPITracks(title, limit)
    setTracks(data)
    console.log(data)

    setLoading(false)
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-col justify-center items-center gap-5 w-full">
          <View className="w-full">
            <View className="flex flex-row justify-between gap-6">
              <Pressable onPress={() => router.back()} className="w-fit">
                <Feather
                  name="arrow-left"
                  size={24}
                  color="#1c1c1c"
                  className="p-4"
                />
              </Pressable>
<View className="flex flex-row justify-center items-center h-full">
                <Text className="text-xl font-semibold">Danh sách phát</Text>
              </View>
              <Pressable onPress={() => router.back()} className="w-fit">
                <Feather
                  name="more-vertical"
                  size={24}
                  color="#1c1c1c"
                  className="p-4"
                />
              </Pressable>
            </View>
          </View>
          {iconHeader}
          <View>
            <Text className="font-semibold text-xl text-center">
              {params.title}
            </Text>
            <Text className="text-gray-500 text-base text-center">
              {params.count} bài hát
            </Text>
          </View>
          <View className="flex flex-row justify-centers gap-10 items-center">
            <Pressable className="flex flex-col items-center">
              <CircleArrowDown size={24} strokeWidth={1.5} color={"#000"} />
              <Text className="text-sm">Tải xuống</Text>
            </Pressable>
            <Pressable onPress={() => {
              if (params.count !== '0') {
                LoadSearch("Trình", 10)
              }
            }} className={`${colorPlayer} px-7 py-3 rounded-full`}>
              <Text className="text-white text-lg font-semibold">Phát nhạc</Text>
            </Pressable>
            <Pressable className="flex flex-col items-center" onPress={() => { }}>
              <CirclePlus size={24} strokeWidth={1.5} color={"#000"} />
              <Text className="text-sm">Thêm bài</Text>
            </Pressable>
          </View>
          <View>
            {loading && <Text className="text-gray-400 text-center">Đang tải bài hát...</Text>}

            {/* {tracks.map((track, i) => (
              <View key={i} className="p-3 border-b border-gray-200">
                <Text className="font-semibold">{track.title}</Text>
                <Text className="text-gray-500">{track.artist}</Text>

                <Pressable
                  className="mt-2 bg-blue-500 p-2 rounded"
                  onPress={async () => {
                    const { sound } = await Audio.Sound.createAsync({ uri: track.audioUrl });
                    await sound.playAsync();
                  }}
                >
                  <Text className="text-white text-center">▶️ Phát</Text>
                </Pressable>
              </View>
            ))} */}


            {/* <FlatList
              data={tracks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    marginBottom: 12,
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{ uri: item.album.images[0].url }}
style={{ width: 60, height: 60, borderRadius: 10, marginRight: 10 }}
                  />
                  <View>
                    <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                    <Text>{item.artists.map((a) => a.name).join(", ")}</Text>
                  </View>
                </TouchableOpacity>
              )}
            /> */}

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}