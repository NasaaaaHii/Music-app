import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import { Moon } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import playlistBUS from "../../../backend/BUS/playlistBUS";
import {
  FIREBASE_AUTH,
  getError,
  onAuthStateChanged,
} from "../../../config/firebaseConfig";
import { getTrack, topAlbum } from "../../../config/musicApi";
import ButtonAnimation from "../../Animations/ButtonAnimation";
import MusicCard from "../../Components/MusicCard";
import { t } from "../../theme";

type albumMusic = {
  id: string;
  playlist_name: string;
  playlist_contents: string[];
  image: string;
};
export default function Home() {
  const dataButton = [
    { id: "1", title: "Tất cả" },
    { id: "2", title: "Nhạc" },
    { id: "3", title: "Album" },
    { id: "4", title: "Nghệ sĩ" },
  ];
  const [refreshing, setRefreshing] = useState(false);
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const isWeb = Platform.OS === "web";
  const isTablet = dimensions.width >= 768;
  const isDesktop = dimensions.width >= 1024;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);
  const handlePress = (item: string) => {
    setActiveFilter(item);
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  const date = new Date();
  const hour = date.getHours();

  const openList = (pl: any) => {
    console.log("openList:", pl.id, pl.songs?.length);
    router.push({
      pathname: "/AlbumPlaylist",
      params: {
        id: String(pl.id),
        title: pl.title,
        image: pl.img ?? pl.image ?? "",
        songs: JSON.stringify(pl.songs ?? []),
      },
    });
  };

  const [valid, setValid] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [playlistsDB, setPlaylistsDB] = useState<any>();
  const [albumData, setAlbumData] = useState<albumMusic[]>();
  async function _topAlbum() {
    const data = await topAlbum();
    const newdata = data.map((item: any) => {
      const img =
        item.artwork?.["1000x1000"] ||
        item.artwork?.["480x480"] ||
        item.artwork?.["150x150"] ||
        "https://cdn-icons-png.flaticon.com/512/727/727245.png";
      return {
        id: item.id,
        playlist_name: item.playlist_name,
        playlist_contents: item.playlist_contents.map((item2: any) => {
          return item2.track_id;
        }),
        image: img,
      };
    });
    // console.log(data);
    setAlbumData(newdata);
    console.log(newdata);
  }
  async function loadDB() {
    try {
      const dataPlaylist = await playlistBUS.getPlaylist(
        FIREBASE_AUTH.currentUser?.uid!
      );
      _topAlbum();
      console.log(FIREBASE_AUTH.currentUser?.uid);

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

      console.log(newDataPlayList);

      setPlaylistsDB(newDataPlayList);
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
  }, []);

  if (loadingPage)
    return (
      <View className="flex-1 bg-purple-900 justify-center items-center">
        <ActivityIndicator size={"large"} color="white" />
      </View>
    );
  if (!valid) return <Redirect href="/" />;

  return (
    <ScrollView
      className="flex-1 "
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      style={{ backgroundColor: t.tabBarBg }}
    >
      <View
        className={`pb-6 mb-24 ${
          isWeb
            ? isDesktop
              ? "px-12 pt-24"
              : isTablet
                ? "px-8 pt-20"
                : "px-5 pt-20"
            : "px-5 pt-20"
        }`}
      >
        <View
          className={`flex flex-row justify-between items-center ${
            isWeb && isDesktop ? "mb-12" : "mb-10"
          }`}
        >
          <View className="flex-1">
            <Text
              className={`font-bold mb-3 ${
                isWeb && isDesktop ? "text-6xl" : "text-5xl"
              }`}
              style={{ color: t.text, letterSpacing: 0.5 }}
            >
              Chào buổi
              {hour >= 6 && hour <= 12
                ? " sáng!"
                : hour <= 18 && hour > 12
                  ? " trưa!"
                  : " tối!"}
            </Text>
            <Text
              className={`font-normal ${
                isWeb && isDesktop ? "text-xl" : "text-lg"
              }`}
              style={{ color: t.textMuted }}
            >
              Chào mừng bạn đến với Music - App
            </Text>
          </View>
          <TouchableOpacity
            className="p-4 rounded-full overflow-hidden"
            style={{
              shadowColor: t.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 8,
            }}
          >
            <LinearGradient
              colors={t.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Moon color={t.surface} size={28} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <FlatList
          data={dataButton}
          renderItem={({ item }) => (
            <ButtonAnimation
              item={item.title}
              onPress={() => handlePress(item.title)}
              isActive={activeFilter === item.title}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        />
        <View className={`${isWeb && isDesktop ? "mt-16" : "mt-12"}`}>
          <Text
            className={`font-bold mb-6 ${
              isWeb && isDesktop ? "text-3xl" : "text-2xl"
            }`}
            style={{ color: t.text, letterSpacing: 0.3 }}
          >
            Gợi ý cho bạn
          </Text>
          <TouchableOpacity
            className="relative overflow-hidden rounded-3xl"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Image
              source={{
                uri:
                  albumData?.[0]?.image ||
                  "https://cdn-icons-png.flaticon.com/512/727/727245.png",
              }}
              className="w-full"
              style={{ height: isWeb && isDesktop ? 320 : 224 }}
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent justify-end p-6 md:p-8">
              <Text
                className={`font-bold mb-2 ${
                  isWeb && isDesktop ? "text-5xl" : "text-3xl md:text-4xl"
                }`}
                style={{ color: t.text, letterSpacing: 0.5 }}
              >
                Nhạc hot tuần
              </Text>
              <Text
                className={`mb-4 ${
                  isWeb && isDesktop ? "text-lg" : "text-sm md:text-base"
                }`}
                style={{ color: t.textMuted }}
              >
                Top 50 bài hát hay nhất tuần
              </Text>
              <TouchableOpacity
                onPress={() => {
                  const trendingPlaylist = albumData?.[0];
                  if (trendingPlaylist) {
                    openList({
                      id: trendingPlaylist.id,
                      title: trendingPlaylist.playlist_name,
                      artist: "Trending",
                      image: trendingPlaylist.image,
                      songs: trendingPlaylist.playlist_contents || [],
                    });
                  }
                }}
              >
                <LinearGradient
                  colors={t.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    width: isWeb && isDesktop ? 150 : 130,
                    height: isWeb && isDesktop ? 52 : 48,
                    justifyContent: "center",
                    alignItems: "center",
                    shadowColor: t.primary,
                    shadowOpacity: 0.5,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <Text
                    className={`font-bold ${
                      isWeb && isDesktop ? "text-lg" : "text-base"
                    }`}
                    style={{ color: t.surface, letterSpacing: 0.5 }}
                  >
                    Phát ngay
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
        {(activeFilter === "Tất cả" || activeFilter === "Nhạc") && (
          <View className="mt-10">
            <View className="flex flex-row justify-between items-center mb-6">
              <Text
                className="font-bold text-2xl"
                style={{ color: t.text, letterSpacing: 0.3 }}
              >
                Playlist đề xuất
              </Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("Navigate to all playlists");
                }}
              >
                <Text
                  className="font-semibold text-base"
                  style={{ color: t.primary }}
                >
                  Xem tất cả
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              className="mt-6"
              data={playlistsDB}
              renderItem={({ item }) => {
                const normalized = {
                  id: item.id,
                  title: item.name,
                  artist: "Playlist",
                  image: item.img,
                  songs: item.songs || [],
                };
                return (
                  <TouchableOpacity onPress={() => openList(normalized)}>
                    <MusicCard item={normalized} variant="withList" />
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          </View>
        )}
        {(activeFilter === "Tất cả" || activeFilter === "Album") && (
          <View className="mt-10">
            <View className="flex flex-row justify-between items-center mb-6">
              <Text
                className="text-2xl font-bold"
                style={{ color: t.text, letterSpacing: 0.3 }}
              >
                Album mới phát hành
              </Text>
              <TouchableOpacity
                onPress={() => {
                  // Navigate to albums section or dedicated albums page
                  console.log("Navigate to all albums");
                }}
              >
                <Text
                  className="font-semibold text-base"
                  style={{ color: t.primary }}
                >
                  Xem tất cả
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              className="mt-6"
              data={albumData}
              renderItem={({ item }) => {
                const mapItems = {
                  id: item.id,
                  title: item.playlist_name,
                  artist: "Albums",
                  image: item.image,
                  songs: item.playlist_contents || [],
                };
                // console.log("Mapped:", mapItems);
                return (
                  <TouchableOpacity onPress={() => openList(mapItems)}>
                    <MusicCard item={mapItems} variant="withList" />
                  </TouchableOpacity>
                );
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
}
