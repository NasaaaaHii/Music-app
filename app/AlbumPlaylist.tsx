import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  CirclePlus,
  Heart,
  ListMusic,
  Pause,
  Play,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../assets/images/nhac_1.png";
import { getTrack } from "../config/musicApi";
import MusicCard from "./Components/MusicCard";
import { useMusic } from "./Context/MusicContext";
import { t } from "./theme";

const AlbumPlaylist = () => {
  const { setCurrentTrack } = useMusic();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const params = useLocalSearchParams<{
    id?: string;
    title?: string;
    songs?: string;
    image?: string;
  }>();
  const [tracks, setTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const songIds: string[] = (() => {
    try {
      const s = params.songs ? JSON.parse(String(params.songs)) : [];
      console.log(
        "params.songs raw len:",
        String(params.songs ?? "").length,
        "ids:",
        s.length
      );
      return s;
    } catch {
      return [];
    }
  })();
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const ids = songIds;
      if (!ids.length) {
        if (mounted) setTracks([]);
        return;
      }
      setLoading(true);
      try {
        const meta: any = [];
        for (let i = 0; i < songIds.length; i++) {
          const track = await getTrack(parseInt(ids[i]));
          if (track) {
            meta.push({
              id: String(track.id),
              title: track.title,
              artist: track.user?.name || track.artists?.[0]?.name || "Nghệ sĩ",
              image:
                track.artwork?.["480x480"] || track.artwork?.["150x150"] || "",
            });
          }
          console.log(songIds[i]);
        }
        if (mounted) setTracks(meta);
        console.log("Loaded tracks:", meta.length);
      } catch (e) {
        console.log("load tracks error:", (e as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [params.songs]);
  const openPlayer = (item: any, index: number) => {
    setCurrentTrack(item, tracks, index);
  };
  console.log(songIds);
  console.log(tracks);
  return (
    <ScrollView className="flex-1" style={{ backgroundColor: t.tabBarBg }}>
      <View className="px-4 pb-8 pt-14">
        <View className="flex flex-row gap-20">
          <TouchableOpacity
            className="rounded-full"
            onPress={() => router.back()}
          >
            <ChevronLeft color={t.text} size={28} strokeWidth={2.5} />
          </TouchableOpacity>
          <Image
            className="rounded-full"
            style={{
              backgroundColor: t.textMuted,
              width: 120,
              height: 120,
            }}
            source={
              params.image
                ? { uri: String(params.image) }
                : require("../assets/images/nhac_1.png")
            }
          />
        </View>
        <View className="mt-10 flex flex-col gap-4">
          <View className="flex flex-row gap-5 items-center">
            <ListMusic color={t.primary} size={24} strokeWidth={2} />
            <Text className="text-xl font-bold" style={{ color: t.text }}>
              Dành cho bạn
            </Text>
          </View>
          <Text className="text-xl font-bold" style={{ color: t.text }}>
            {params.title || "Playlist"}
          </Text>
          <Text className="text-md font-normal" style={{ color: t.textMuted }}>
            {tracks.length} bài hát
          </Text>
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row gap-7 items-center">
              <Image
                className="rounded-full"
                style={{
                  backgroundColor: t.textMuted,
                  width: 40,
                  height: 40,
                }}
                source={{ uri: String(params.image) }}
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
            data={tracks}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => openPlayer(item, index)}>
                <MusicCard item={item} variant="albumList" />
              </TouchableOpacity>
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
