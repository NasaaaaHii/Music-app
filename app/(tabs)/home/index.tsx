import { LinearGradient } from "expo-linear-gradient";
import { Redirect, router } from "expo-router";
import { Moon } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
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
import { getTrack } from "../../../config/musicApi";
import ButtonAnimation from "../../Animations/ButtonAnimation";
import MusicCard from "../../Components/MusicCard";
import { t } from "../../theme";
export default function Home() {
  const dataButton = [
    { id: "1", title: "Tất cả" },
    { id: "2", title: "Nhạc" },
    { id: "3", title: "Album" },
    { id: "4", title: "Nghệ sĩ" },
  ];
  const [refreshing, setRefreshing] = useState(false);
  const handlePress = (item: string) => {
    alert(`${item}`);
  };
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };
  const date = new Date();
  const hour = date.getHours();

  const images = {
    nhac1: require("../../../assets/images/nhac_1.png"),
    nhac2: require("../../../assets/images/nhac_2.png"),
    nhac3: require("../../../assets/images/nhac_3.png"),
  };
  const albumData = [
    {
      id: "1",
      title: "Album 1",
      artist: "Nghệ sĩ A",
      year: "2025",
      img: images.nhac1,
    },
    {
      id: "2",
      title: "Album 2",
      artist: "Nghệ sĩ B",
      year: "2024",
      img: images.nhac2,
    },
    {
      id: "3",
      title: "Album 3",
      artist: "Nghệ sĩ C",
      year: "2024",
      img: images.nhac3,
    },
  ];
  const openPlayer = (item: any) => {
    console.log(item);
    router.push({
      pathname: "/Player",
      params: {
        id: String(item.id || ""),
        title: item.title || "Đang phát",
        artist: item.artist || "Nghệ sĩ",
      },
    });
  };

  const openList = (pl: any) => {
    console.log("openList:", pl.id, pl.songs?.length);
    router.push({
      pathname: "/AlbumPlaylist",
      params: {
        id: String(pl.id),
        title: pl.name,
        image: pl.img ?? pl.image ?? "",
        songs: JSON.stringify(pl.songs ?? []),
      },
    });
  };

  const [valid, setValid] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [playlistsDB, setPlaylistsDB] = useState<any>();
  async function loadDB() {
    try {
      const dataPlaylist = await playlistBUS.getPlaylist(
        FIREBASE_AUTH.currentUser?.uid!
      );

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
      <View className="px-5 pt-16 pb-6 mb-24">
        <View className="flex flex-row justify-between items-center mb-8">
          <View className="flex-1">
            <Text className="font-bold text-4xl mb-2" style={{ color: t.text }}>
              Chào buổi
              {hour >= 6 && hour <= 12
                ? " sáng!"
                : hour <= 18 && hour > 12
                  ? " trưa!"
                  : " tối!"}
            </Text>
            <Text
              className="font-normal text-base"
              style={{ color: t.textMuted }}
            >
              Chào mừng bạn đến với Music - App
            </Text>
          </View>
          <TouchableOpacity
            className="p-3 rounded-full"
            style={{
              backgroundColor: t.primary,
              borderColor: t.tabBarBorder,
              borderWidth: 1,
            }}
          >
            <Moon color={t.cardBg} size={28} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={dataButton}
          renderItem={({ item }) => (
            <ButtonAnimation
              item={item.title}
              onPress={() => handlePress(item.title)}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12 }}
        />
        <View className="mt-10">
          <Text className="font-bold text-xl mb-4" style={{ color: t.text }}>
            Gợi ý cho bạn
          </Text>
          <TouchableOpacity className="relative overflow-hidden rounded-2xl">
            <Image source={images.nhac2} className="w-full h-48" />
            <View className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent justify-end p-6">
              <Text
                className="font-bold text-3xl mb-1"
                style={{ color: t.text }}
              >
                Nhạc hot tuần
              </Text>
              <Text className="mb-3 text-sm" style={{ color: t.textMuted }}>
                Top 50 bài hát hay nhất tuần
              </Text>
              <LinearGradient
                colors={t.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 12,
                  width: 110,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  shadowColor: t.primary,
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                  elevation: 6,
                }}
              >
                <Text className="font-bold text-sm" style={{ color: t.text }}>
                  Phát ngay
                </Text>
              </LinearGradient>
            </View>
          </TouchableOpacity>
        </View>
        <View className="mt-8">
          <View className="flex flex-row justify-between items-center">
            <Text className="font-bold text-xl" style={{ color: t.text }}>
              Playlist đề xuất
            </Text>
            <TouchableOpacity>
              <Text className="font-semibold" style={{ color: t.primary }}>
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
        <View className="mt-6">
          <View className="flex flex-row justify-between items-center">
            <Text className="text-xl font-bold" style={{ color: t.text }}>
              Album mới phát hành
            </Text>
            <TouchableOpacity>
              <Text className="font-semibold" style={{ color: t.primary }}>
                Xem tất cả
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            className="mt-6"
            data={albumData}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openList(item)}>
                <MusicCard item={item} variant="albumBoard" />
              </TouchableOpacity>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}
