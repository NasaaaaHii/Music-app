import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import { Heart, LibraryBig, Music, Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import playlistBUS from "../../../backend/BUS/playlistBUS";
import userBUS from "../../../backend/BUS/userBUS";
import {
  FIREBASE_AUTH,
  getError,
  onAuthStateChanged,
} from "../../../config/firebaseConfig";
import { getTrack } from "../../../config/musicApi";
import { t } from "../../theme";

export default function Index() {
  const [DBUser, setDBUser] = useState<any>(null);
  const [DBPlaylist, setDBPlaylist] = useState<any>(null);
  const [valid, setValid] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const isWeb = Platform.OS === "web";
  const isTablet = dimensions.width >= 768;
  const isDesktop = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  async function loadDB(uid: string) {
    try {
      const dataUser = await userBUS.getUserById(uid);
      const dataPlaylist = await playlistBUS.getPlaylist(uid);

      const newDataPlayList = await Promise.all(
        dataPlaylist.map(async (item) => {
          if (item.songs.length === 0) return item;

          const x = await getTrack(item.songs[0]);
          const data =
            x.artwork?.["1000x1000"] ||
            x.artwork?.["480x480"] ||
            x.artwork?.["150x150"] ||
            "https://cdn-icons-png.flaticon.com/512/727/727245.png";
          return {
            ...item,
            img: item.songs.length > 0 ? data : "",
          };
        })
      );

      setDBUser(dataUser);
      setDBPlaylist(newDataPlayList);
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
          await loadDB(user?.uid);
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
    const sub = DeviceEventEmitter.addListener("playlistStatus", (status) => {
      if (status === "success")
        (async () => {
          await loadDB(FIREBASE_AUTH.currentUser!.uid);
        })();
    });
    const sub2 = DeviceEventEmitter.addListener("changePlaylistName", (status) => {
      if (status === "success")
        (async () => {
          await loadDB(FIREBASE_AUTH.currentUser!.uid);
        })();
    });
    const sub3 = DeviceEventEmitter.addListener("statusPlaylists", (status) => {
      if (status === "success")
        (async () => {
          await loadDB(FIREBASE_AUTH.currentUser!.uid);
        })();
    });
    return () => {
      sub.remove();
      sub2.remove();
      sub3.remove();
    };
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
        {/* Header */}
        <View 
          className={`flex justify-center items-center gap-3 w-full ${
            isWeb 
              ? isDesktop 
                ? "p-16" 
                : isTablet 
                  ? "p-12" 
                  : "p-10"
              : "p-10"
          }`}
        >
          <LinearGradient
            colors={t.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className={`rounded-full ${
              isWeb && isDesktop ? "p-12" : "p-10"
            }`}
            style={{
              shadowColor: t.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 12,
            }}
          >
            <LibraryBig 
              size={isWeb && isDesktop ? 60 : 50} 
              color={t.surface} 
            />
          </LinearGradient>
          <Text 
            className={`font-bold ${
              isWeb && isDesktop ? "text-4xl" : "text-3xl"
            }`}
            style={{ color: t.text }}
          >
            Thư viện
          </Text>
          <Text 
            className={isWeb && isDesktop ? "text-lg" : "text-base"}
            style={{ color: t.textMuted }}
          >
            {DBPlaylist?.length || 0} danh sách phát
          </Text>
        </View>

        {/* Main */}
        <View 
          className={`flex flex-col items-start pb-80 ${
            isWeb 
              ? isDesktop 
                ? "gap-16 px-12" 
                : isTablet 
                  ? "gap-14 px-8" 
                  : "gap-14 px-6"
              : "gap-14"
          }`}
        >
          {/* Danh mục */}
          <View className="flex gap-5 w-full">
            <Text
              className={`font-semibold ${
                isWeb && isDesktop ? "text-2xl" : "text-xl"
              }`}
              style={{ color: t.text }}
            >
              Danh mục
            </Text>
            <View 
              className={`flex flex-row ${
                isWeb && isDesktop ? "gap-6" : "gap-5"
              }`}
            >
              <Pressable onPress={() => router.push("/library/liked")}>
                <View
                  className={`p-4 flex flex-col justify-between rounded-2xl ${
                    isWeb && isDesktop 
                      ? "w-[160px] h-[160px]" 
                      : "w-[130px] h-[130px]"
                  }`}
                  style={{ 
                    backgroundColor: t.cardBg,
                    shadowColor: t.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <Heart size={30} color={t.primary} />
                  <View>
                    <Text
                      className="text-md font-semibold"
                      style={{ color: t.text }}
                    >
                      Yêu thích
                    </Text>
                    <Text className="text-sm" style={{ color: t.textMuted }}>
                      {DBUser?.liked?.length || 0} bài hát
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Danh sách phát */}
          <View className="w-full flex gap-5">
            <Text
              className={`font-semibold ${
                isWeb && isDesktop ? "text-2xl" : "text-xl"
              }`}
              style={{ color: t.text }}
            >
              Danh sách phát
            </Text>
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/modal/create-playlist",
                });
              }}
            >
              <View
                className={`flex flex-row items-center gap-5 rounded-xl ${
                  isWeb && isDesktop ? "p-5" : "p-4"
                }`}
                style={{ 
                  backgroundColor: t.cardBg,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <View
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: t.cardHover }}
                >
                  <Plus size={40} color={t.textMuted} />
                </View>
                <Text
                  className="text-md font-semibold"
                  style={{ color: t.text }}
                >
                  Tạo danh sách phát
                </Text>
              </View>
            </Pressable>

            <FlatList
              scrollEnabled={false}
              data={DBPlaylist}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 25,
                paddingHorizontal: 0,
                paddingVertical: 3,
              }}
              style={{ flexGrow: 0 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/library/playlists",
                      params: {
                        type: "playlists",
                        idPlaylists: item.id,
                      },
                    });
                  }}
                >
                  <View
                    className="flex flex-row items-center gap-5 ml-6 mr-6 rounded-xl"
                    style={{ 
                      backgroundColor: t.cardBg,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 8,
                      elevation: 4,
                    }}
                  >
                    {item.songs.length > 0 ? (
                      <Image
                        source={{ uri: item.img }}
                        style={{ width: 83, height: 83 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        className="p-6 rounded-lg"
                        style={{ backgroundColor: t.cardHover }}
                      >
                        <Music size={40} color={t.textMuted} />
                      </View>
                    )}

                    <View>
                      <Text
                        className="text-md font-semibold"
                        style={{ color: t.text }}
                      >
                        {item.name}
                      </Text>
                      <Text className="text-sm" style={{ color: t.textMuted }}>
                        {item.songs.length} bài hát
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
