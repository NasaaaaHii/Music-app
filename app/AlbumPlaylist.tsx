import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ChevronLeft,
  CirclePlus,
  Heart,
  ListMusic,
  Pause,
  Play,
} from "lucide-react-native";
import { useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../assets/images/nhac_1.png";
import MusicCard from "./Components/MusicCard";
import { t } from "./theme";
type MusicType = {
  id: string;
  title: string;
  image: ImageSourcePropType;
  musicArtist: string[];
};
const AlbumPlaylist = ({ like, time }: { like: number; time: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const albumData: MusicType[] = [
    {
      id: "1",
      title: "Nhạc 1",
      image: require("../assets/images/nhac_1.png"),
      musicArtist: ["ca sĩ 1", "ca sĩ 2"],
    },
    {
      id: "2",
      title: "Nhạc 2",
      image: require("../assets/images/nhac_2.png"),
      musicArtist: ["ca sĩ 1", "ca sĩ 2 , ca sĩ 3"],
    },
    {
      id: "3",
      title: "Nhạc 3",
      image: require("../assets/images/nhac_3.png"),
      musicArtist: ["ca sĩ 1"],
    },
  ];
  return (
    <ScrollView className="flex-1" style={{ backgroundColor: t.tabBarBg }}>
      <View className="px-4 pb-8 pt-14">
        <View className="flex flex-row gap-16 items-center">
          <TouchableOpacity
            className="rounded-full"
            onPress={() => router.back()}
          >
            <ChevronLeft color={t.text} size={28} strokeWidth={2.5} />
          </TouchableOpacity>
          <Image
            className="h-60 w-60 rounded-2xl"
            source={require("../assets/images/nhac_3.png")}
            style={{
              shadowColor: t.primary,
              shadowOpacity: 0.5,
              shadowRadius: 20,
            }}
          />
        </View>
        <View className="mt-10 flex flex-col gap-4">
          <View className="flex flex-row gap-5 items-center">
            <ListMusic color={t.primary} size={24} strokeWidth={2} />
            <Text className="text-xl font-bold" style={{ color: t.text }}>
              Dành cho bạn
            </Text>
          </View>
          <Text className="text-md font-normal" style={{ color: t.textMuted }}>
            {111} người thích - thời lượng: {11} phút
          </Text>
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row gap-7 items-center">
              <Image
                className="h-12 w-12 rounded-full"
                source={require("../assets/images/nhac_3.png")}
              />
              <CirclePlus color={t.textMuted} size={28} strokeWidth={2} />
              <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
                <Heart
                  color={isLiked ? t.primary : t.textMuted}
                  size={28}
                  fill={isLiked ? t.primary : "transparent"}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
            <LinearGradient
              colors={t.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 9999,
                padding: 14,
                shadowColor: t.primary,
                shadowOpacity: 0.6,
                shadowRadius: 15,
                elevation: 12,
              }}
            >
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setIsPlaying(!isPlaying);
                }}
                activeOpacity={0.8}
              >
                {isPlaying ? (
                  <Pause color="#fff" size={26} fill="#fff" strokeWidth={0} />
                ) : (
                  <Play color="#fff" size={26} fill="#fff" strokeWidth={0} />
                )}
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
        <View className="flex flex-col gap-4 mt-10">
          <FlatList
            data={albumData}
            renderItem={({ item }) => (
              <MusicCard item={item} variant="albumList" />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 12 }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default AlbumPlaylist;
