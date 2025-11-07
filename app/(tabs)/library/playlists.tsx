import { Feather } from "@expo/vector-icons";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import {
  CircleArrowRight,
  CirclePlus,
  EllipsisVertical,
  Heart,
  Music,
  Pause
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MusicEqualizer from "../../Components/MusicEqualizer";

import { useAudioPlayer } from "expo-audio";
import playlistBUS from "../../../backend/BUS/playlistBUS";
import {
  FIREBASE_AUTH,
  getError,
  onAuthStateChanged,
} from "../../../config/firebaseConfig";
import { getTrack, getTrackStreamUrl } from "../../../config/musicApi";

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

  const params = useLocalSearchParams<any>();
  const [loading, setLoading] = useState(false);
  const [posMusicPlaying, setPosMusicPlaying] = useState<any>(null);
  const [urlMusicPlaying, setUrlMusicPlaying] = useState<any>(null);

  const [isPlaying, setIsPlaying] = useState(0)

  const player = useAudioPlayer(
    urlMusicPlaying
    // "https://discoveryprovider.audius.co/v1/tracks/855148/stream?app_name=musicapp"
  );

  useEffect(() => {
    // if (params.type === "category") {
    //   setIconHeader(
    //     <View className="flex flex-row justify-center items-center bg-[#f0eff4] rounded-xl">
    //       <Feather
    //         name={"heart"}
    //         size={100}
    //         color={"#d0cfd5"}
    //         className="aspect-square p-28"
    //       />
    //     </View>
    //   );
    // } else if (params.type === "playlists") {
    //   if (params.firstMusic == null) {
    //     setIconHeader(
    //     );
    //   } else {
    //     setIconHeader(
    //     );
    //   }
    // }
  }, []);

  const [valid, setValid] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [DBPlaylist, setDBPlaylist] = useState<any>(null);
  const [DBSongList, setDBSongList] = useState<any>(null);

  async function loadDB() {
    try {
      const uid = FIREBASE_AUTH.currentUser!.uid;
      const plid = params.idPlaylists;
      const data = await playlistBUS.getPlaylistByIdPL(uid, plid);

      const newData = await Promise.all(
        data.songs.map(async (id) => {
          const item = await getTrack(id);
          const url = await getTrackStreamUrl(id);

          const artistList =
            item.artists?.length > 0
              ? item.artists.map((a: any) => a.name)
              : item.user?.name
                ? [item.user.name]
                : [];

          const artworkUrl =
            item.artwork?.["1000x1000"] ||
            item.artwork?.["480x480"] ||
            item.artwork?.["150x150"] ||
            "https://cdn-icons-png.flaticon.com/512/727/727245.png";

          return {
            id: id,
            title: item.title,
            artists: artistList,
            access: {
              download: item.access?.download ?? true,
              stream: item.access?.stream ?? true,
            },
            image: artworkUrl,
            url: url,
          };
        })
      );
      setDBPlaylist(data);
      setDBSongList(newData);
    } catch (e) {
      const err = e as Error;
      console.log(err.message);
    }
  }

  async function init() {
    try {
      setLoadingPage(true);
      const f = await onAuthStateChanged(FIREBASE_AUTH, async (user) => {
        if (user && user.emailVerified) {
          setValid(user);
          await loadDB();
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
    const sub = DeviceEventEmitter.addListener(
      "statusSearchMusicList",
      (status) => {
        if (status === "success")
          (async () => {
            await loadDB();
            DeviceEventEmitter.emit("statusPlaylists", "success");
          })();
      }
    );
    return () => sub.remove();
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

          {DBSongList.length > 0 && (
            <View className="flex px-20 flex-row justify-center items-center">
              <Image
                source={{ uri: DBSongList[0].image }}
                resizeMode="cover"
                style={{ width: 250, height: 250, borderRadius: 10 }}
              />
            </View>
          )}
          {DBSongList.length === 0 && (
            <View className="flex flex-row justify-center items-center bg-[#f0eff4] rounded-xl p-20">
              <Music size={100} color={"#d0cfd5"} />
            </View>
          )}

          <View>
            <Text className="font-semibold text-xl text-center">
              {DBPlaylist.name}
            </Text>
            <Text className="text-gray-500 text-base text-center">
              {DBPlaylist.songs.length} bài hát
            </Text>
          </View>
          <View className="flex flex-row justify-centers gap-10 items-center">
            <Pressable
              className="flex flex-col items-center"
              onPress={() => {
                // player.seekTo(0);
                // player.pause();
                const pos = (posMusicPlaying + 1) % DBSongList.length
                setPosMusicPlaying(pos)
                setUrlMusicPlaying(DBSongList[pos].url)
              }}
            >
              <CircleArrowRight size={24} strokeWidth={1.5} color={"#000"} />
              <Text className="text-sm">Bài kế</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (DBSongList.length > 0) {
                  if(posMusicPlaying === null){
                    setPosMusicPlaying(0)
                    setUrlMusicPlaying(DBSongList[0].url)
                    player.play()
                  }

                  const x = 1 - isPlaying
                  setIsPlaying(x)
                  if(x === 0) player.pause()
                  else player.play()
                }
              }}
              className={`${DBSongList.length > 0 ? 'bg-[#8546ec]' : 'bg-gray-300' } px-7 py-3 rounded-full`}
            >
              <Text className="text-white text-lg font-semibold">
                {isPlaying === 0 ? "Phát nhạc" : "Tạm dừng"} 
              </Text>
            </Pressable>
            <Pressable
              className="flex flex-col items-center"
              onPress={() => {
                router.push({
                  pathname: "/library/addMusic",
                  params: {
                    idPlaylists: params.idPlaylists,
                  },
                });
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
              data={DBSongList}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 0,
              }}
              renderItem={({ item, index }) => (
                <View
                  className={`flex flex-row items-center p-3 ${urlMusicPlaying === item.url ? "bg-gray-100" : ""} `}
                >
                  <Pressable
                    onPress={() => {
                      if(index===posMusicPlaying){
                        const x = 1 - isPlaying
                        setIsPlaying(x)
                        if(x === 0) player.pause()
                        else player.play()
                      }
                      else{
                        setUrlMusicPlaying(item.url)
                        setPosMusicPlaying(index)
                        player.play()
                      }
                    }}
                    className={`${urlMusicPlaying === item.url ? "opacity-50" : "opacity-100"}`}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 70, height: 70, borderRadius: 10 }}
                      resizeMode="cover"
                    />
                    {urlMusicPlaying === item.url && (
                      <View className="absolute top-0 bottom-0 right-0 left-0 felx justify-center items-center">
                        {isPlaying === 0 ? <Pause size={40} />: <MusicEqualizer /> }
                      </View>
                    )}
                  </Pressable>
                  <View className="flex-1 mx-3">
                    <Text className="font-semibold text-base">{item.title}</Text>
                    <Text className="text-sm text-gray-500">
                      {item.artists.join(", ")}
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
