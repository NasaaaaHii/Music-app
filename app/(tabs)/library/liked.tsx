import { Redirect, router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Heart,
  Pause,
  Play
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

import { useAudioPlayer } from "expo-audio";
import likedBUS from "../../../backend/BUS/likedBUS";
import {
  FIREBASE_AUTH,
  getError,
  onAuthStateChanged,
} from "../../../config/firebaseConfig";
import { getTrack, getTrackStreamUrl } from "../../../config/musicApi";
import MusicEqualizer from "../../Components/MusicEqualizer";
import { t } from "../../theme";

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
  const [currentUrl, setCurrUrl] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState(0);

  const player = useAudioPlayer();

  //   useEffect(() => {
  //     if(!urlMusicPlaying) return

  //     if(currentUrl !== urlMusicPlaying){
  //       player.replace(urlMusicPlaying)
  //       setCurrUrl(urlMusicPlaying)
  //     }

  //     if(isPlaying === 0) player.pause()
  //     else player.play()
  //   }, [urlMusicPlaying, isPlaying])

  const [valid, setValid] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [DBLiked, setDBLiked] = useState<any>(null);

  async function loadDB() {
    try {
      const uid = FIREBASE_AUTH.currentUser?.uid!;
      const data = await likedBUS.getLiked(uid);
      console.log(data.liked);

      const newData = await Promise.all(
        data.liked.map(async (id) => {
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

      console.log(newData);
      setDBLiked(newData);
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
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: t.surface }}
      >
        <ActivityIndicator size={"large"} color={t.primary} />
      </View>
    );
  if (!valid) return <Redirect href="/" />;
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: t.surface }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="w-full flex flex-col items-center gap-6">
          <View className="w-full">
            <View className="flex flex-row justify-between gap-6">
              <Pressable onPress={() => router.back()} className="w-fit p-4">
                <ArrowLeft size={24} color={"#fff"} strokeWidth={2} />
              </Pressable>
              <View className="flex flex-row justify-center items-center h-full">
                <Text
                  className="text-xl font-semibold"
                  style={{ color: t.text }}
                >
                  Danh mục
                </Text>
              </View>
              <View className="w-fit p-4">
                <ArrowLeft
                  size={24}
                  color={"#rgba(255,255,255,0)"}
                  strokeWidth={2}
                />
              </View>
            </View>
          </View>
          <View className="flex flex-row justify-center items-center bg-[#f0eff4] rounded-xl p-20">
            <Heart size={100} color={"#d0cfd5"} />
          </View>
          <View>
            <Text
              className="font-semibold text-xl text-center"
              style={{ color: t.text }}
            >
              {"Yêu thích"}
            </Text>
            <Text
              className="text-base text-center"
              style={{ color: t.textMuted }}
            >
              {DBLiked?.length || 0} bài hát
            </Text>
          </View>
          <View className="flex flex-row justify-centers gap-10 items-center">
            <Pressable
              onPress={() => {
                if (DBLiked.length > 0) {
                }
              }}
              className={`${DBLiked.length > 0 ? "bg-[#8546ec]" : "bg-gray-300"} p-3 rounded-full`}
            >
              <Play size={24} strokeWidth={2} color={"#fff"} />
            </Pressable>
          </View>

          {/* Main */}
          <View className="w-full pb-80">
            {loading && (
              <Text className="text-center" style={{ color: t.textMuted }}>
                Đang tải bài hát...
              </Text>
            )}
            <FlatList
              scrollEnabled={false}
              data={DBLiked}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                paddingHorizontal: 20,
                paddingVertical: 0,
              }}
              renderItem={({ item, index }) => (
                <View
                  className={`flex flex-row items-center p-3 rounded-lg`}
                  style={{
                    backgroundColor:
                      urlMusicPlaying === item.url
                        ? t.cardHover
                        : "transparent",
                  }}
                >
                  <Pressable
                    // onPress={() => {
                    //   if(index===posMusicPlaying){
                    //     setIsPlaying(1 - isPlaying)
                    //   }
                    //   else{
                    //     setUrlMusicPlaying(item.url)
                    //     setPosMusicPlaying(index)
                    //     setIsPlaying(1)
                    //   }
                    // }}
                    className={`${urlMusicPlaying === item.url ? "opacity-50" : "opacity-100"}`}
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{ width: 70, height: 70, borderRadius: 10 }}
                      resizeMode="cover"
                    />
                    {urlMusicPlaying === item.url && (
                      <View className="absolute top-0 bottom-0 right-0 left-0 felx justify-center items-center">
                        {isPlaying === 0 ? (
                          <Pause size={40} color={t.text} />
                        ) : (
                          <MusicEqualizer />
                        )}
                      </View>
                    )}
                  </Pressable>
                  <View className="flex-1 mx-3">
                    <Text
                      className="font-semibold text-base"
                      style={{ color: t.text }}
                    >
                      {item.title}
                    </Text>
                    <Text className="text-sm" style={{ color: t.textMuted }}>
                      {item.artists.join(", ")}
                    </Text>
                  </View>
                  <View className="flex flex-row items-center gap-1">
                    <Pressable
                      onPress={() => {
                        const newData = [...DBLiked];
                        newData.splice(index, 1);
                        setDBLiked(newData);
                        likedBUS.deleteLiked(
                          FIREBASE_AUTH.currentUser?.uid!,
                          item.id
                        );
                        DeviceEventEmitter.emit("playlistStatus", "success");
                      }}
                    >
                      <Heart
                        width={22}
                        strokeWidth={1.5}
                        fill={t.primary}
                        color={t.primary}
                      />
                    </Pressable>
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
