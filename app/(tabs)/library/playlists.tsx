import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  CircleArrowDown,
  CirclePlus,
  EllipsisVertical,
  Heart,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageProps,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { searchTrackAPI } from "../../../config/musicApi";
import MusicEqualizer from "../../Components/MusicEqualizer";

import { useAudioPlayer } from "expo-audio";

export default function PlayLists() {
  type Track = {
    id: string;
    name: string;
    album: {
      images: {
        url: string;
      }[];
      artists: {
        name: string;
      }[];
    };
  };

  const params = useLocalSearchParams();
  const [iconHeader, setIconHeader] = useState<React.ReactNode>(null);
  const [colorPlayer, setColorPlayer] = useState("bg-gray-300");
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>();
  const [posMusicPlaying, setPosMusicPlaying] = useState("");
  const player = useAudioPlayer(
    "https://discoveryprovider.audius.co/v1/tracks/855148/stream?app_name=musicapp"
  );

  useEffect(() => {
    params.count == "0"
      ? setColorPlayer("bg-gray-300")
      : setColorPlayer("bg-[#8546ec]");
  }, [params.count]);

  useEffect(() => {
    if (params.type === "category") {
      setIconHeader(
        <View className="flex flex-row justify-center items-center bg-[#f0eff4] rounded-xl">
          <Feather
            name={"heart"}
            size={100}
            color={"#d0cfd5"}
            className="aspect-square p-28"
          />
        </View>
      );
    } else if (params.type === "playlists") {
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
        );
      } else {
        setIconHeader(
          <View className="flex px-20 flex-row justify-center items-center">
            <Image
              source={params.firstMusic as ImageProps}
              className="aspect-square w-full rounded-xl"
            />
          </View>
        );
      }
    }
  }, []);

  async function logData() {
    try {
      const data = await searchTrackAPI("Baby");
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    logData();
  }, []);

  function PlayTrack() {
    // setLoading(true);
    // setTracks([]);

    // const data = await SearchAPITracks(title, limit);
    // setTracks(data);
    // console.log(data);

    // setLoading(false);
    // player.play();

    player.play();
    // console.log(getTrackStreamUrl("66622"))
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="w-full flex flex-col items-center gap-6">
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
              {"Yêu thích"}
            </Text>
            <Text className="text-gray-500 text-base text-center">
              {0} bài hát
            </Text>
          </View>
          <View className="flex flex-row justify-centers gap-10 items-center">
            <Pressable
              className="flex flex-col items-center"
              onPress={() => {
                // player.seekTo(0);
                player.pause()
              }}
            >
              <CircleArrowDown size={24} strokeWidth={1.5} color={"#000"} />
              <Text className="text-sm">Tải xuống</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (params.count !== "0") {
                  PlayTrack();
                }
              }}
              className={`${colorPlayer} px-7 py-3 rounded-full`}
            >
              <Text className="text-white text-lg font-semibold">
                Phát nhạc
              </Text>
            </Pressable>
            <Pressable
              className="flex flex-col items-center"
              onPress={() => {
                router.push("/library/addMusic");
              }}
            >
              <CirclePlus size={24} strokeWidth={1.5} color={"#000"} />
              <Text className="text-sm">Thêm bài</Text>
            </Pressable>
          </View>

          {/* Main */}
          <View className="w-full pb-80">
            {loading && (
              <Text className="text-gray-400 text-center">
                Đang tải bài hát...
              </Text>
            )}
            <FlatList
              scrollEnabled={false}
              data={tracks}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 0,
              }}
              renderItem={({ item }) => (
                <View
                  className={`flex flex-row items-center p-3 ${posMusicPlaying === item.id ? "bg-gray-100" : ""} `}
                >
                  <Pressable
                    onPress={() => {
                      setPosMusicPlaying(item.id);
                    }}
                    className={`${posMusicPlaying === item.id ? "opacity-50" : "opacity-100"}`}
                  >
                    <Image
                      source={{ uri: item.album.images[0].url }}
                      style={{ width: 70, height: 70, borderRadius: 10 }}
                    />
                    {posMusicPlaying === item.id && (
                      <View className="absolute top-0 bottom-0 right-0 left-0 felx justify-center items-center">
                        <MusicEqualizer />
                      </View>
                    )}
                  </Pressable>
                  <View className="flex-1 mx-3">
                    <Text className="font-semibold text-base">{item.name}</Text>
                    <Text className="text-sm text-gray-500">
                      {item.album.artists
                        .map((artist) => artist.name)
                        .join(", ")}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center gap-1">
                    <Heart width={22} strokeWidth={1.5} />
                    <EllipsisVertical width={22} strokeWidth={1.5} />
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
