import { LinearGradient } from "expo-linear-gradient";
import { Moon } from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
  // const [time, setTime] = useState(6);
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

  const gridData = [
    { id: "1", title: "Playlist 1", image: images.nhac1, list: "15 bài hát" },
    { id: "2", title: "Playlist 2", image: images.nhac2, list: "20 bài hát" },
    { id: "3", title: "Playlist 3", image: images.nhac3, list: "22 bài hát" },
    { id: "4", title: "Playlist 4", image: images.nhac2, list: "9 bài hát" },
    { id: "5", title: "Playlist 5", image: images.nhac3, list: "19 bài hát" },
    { id: "6", title: "Playlist 6", image: images.nhac1, list: "30 bài hát" },
  ];
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
              backgroundColor: t.cardBg,
              borderColor: t.tabBarBorder,
              borderWidth: 1,
            }}
          >
            <Moon color={t.text} size={28} strokeWidth={2.5} />
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
        <View className="mt-12">
          <Text className="font-bold text-xl" style={{ color: t.text }}>
            Đã nghe gần đây
          </Text>
          <FlatList
            className="mt-6"
            data={gridData}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <MusicCard item={item} variant="default" />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          />
        </View>
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
                <Text
                  className="font-bold text-sm"
                  style={{ color: "#ffffff" }}
                >
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
            data={gridData}
            renderItem={({ item }) => (
              <MusicCard item={item} variant="withList" />
            )}
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
              <MusicCard item={item} variant="albumBoard" />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </ScrollView>
  );
}
