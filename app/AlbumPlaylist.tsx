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
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../assets/images/nhac_1.png";
import { getTrack, getTrackStreamUrl } from "../config/musicApi";
import MusicCard from "./Components/MusicCard";
import { useMusic } from "./Context/MusicContext";
import { t } from "./theme";

const DEFAULT_IMAGE = "https://cdn-icons-png.flaticon.com/512/727/727245.png";

const AlbumPlaylist = () => {
  const {
    setCurrentTrack,
    currentTrack,
    isPlaying,
    isLoadingTrack,
    play,
    pause,
  } = useMusic();
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
      return Array.isArray(s) ? s : [];
    } catch (e) {
      return [];
    }
  })();
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const ids = songIds;
      if (!ids?.length) {
        if (mounted) setTracks([]);
        return;
      }
      setLoading(true);
      try {
        const meta: any = [];
        for (let i = 0; i < songIds.length; i++) {
          const track = await getTrack(parseInt(ids[i]));
          const url = await getTrackStreamUrl(parseInt(ids[i]));
          // setUrl(url);
          // console.log(url);
          // console.log("=>> duration : ", track.duration);
          // setDuration(track.duration);
          if (track) {
            meta.push({
              id: String(track.id),
              title: track.title,
              artist: track.user?.name || track.artists?.[0]?.name || "Nghệ sĩ",
              image:
                track.artwork?.["480x480"] || track.artwork?.["150x150"] || "",
              url: url,
              duration: track.duration,
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
  const openPlayer = async (item: any, index: number) => {
    if (isLoadingTrack) return;
    await setCurrentTrack(item, tracks, index, item.url, item.duration ?? 0);
  };

  const currentTrackIndexInPlaylist = tracks.findIndex(
    (item) => item.id === currentTrack?.id
  );
  const isCurrentPlaylistPlaying =
    currentTrackIndexInPlaylist !== -1 && isPlaying;

  const handleTogglePlaylist = async () => {
    if (isLoadingTrack) return;
    if (!tracks.length) return;

    if (currentTrackIndexInPlaylist !== -1) {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
      return;
    }

    const first = tracks[0];
    await setCurrentTrack(first, tracks, 0, first.url, first.duration ?? 0);
  };
  const totalDurationMinutes = useMemo(() => {
    if (!tracks.length) return 0;
    const totalSeconds = tracks.reduce(
      (sum, track) => sum + (track.duration ?? 0),
      0
    );
    return Math.floor(totalSeconds / 60);
  }, [tracks]);

  const heroImage =
    (params.image && params.image !== "undefined"
      ? String(params.image)
      : tracks[0]?.image) || DEFAULT_IMAGE;

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: t.tabBarBg }}
      >
        <ActivityIndicator size="large" color={t.primary} />
        <Text style={{ color: t.textMuted, marginTop: 12 }}>
          Đang tải playlist...
        </Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={t.heroGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View className="px-5 pt-12 gap-6">
          <TouchableOpacity
            className="w-10 h-10 rounded-full items-center justify-center border border-white/20"
            onPress={() => router.back()}
          >
            <ChevronLeft color={t.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>

          <View className="rounded-3xl overflow-hidden">
            <Image
              source={{ uri: heroImage }}
              style={{ width: "100%", height: 260 }}
              resizeMode="cover"
            />
            <LinearGradient
              colors={["rgba(0,0,0,0.65)", "rgba(0,0,0,0.2)", "transparent"]}
              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              className="absolute inset-0 justify-end p-6"
            >
              <View className="flex-row items-center gap-2 mb-3">
                <ListMusic color={t.primary} size={22} strokeWidth={2.2} />
                <Text style={{ color: t.text, opacity: 0.9 }}>
                  Playlist được tuyển chọn
                </Text>
              </View>
              <Text
                className="font-bold"
                style={{ color: "#fff", fontSize: 30, lineHeight: 38 }}
                numberOfLines={2}
              >
                {params.title || "Playlist"}
              </Text>
              <View className="flex-row flex-wrap gap-3 mt-6">
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                >
                  <Text style={{ color: "#fff", fontSize: 12 }}>
                    {tracks.length} bài hát
                  </Text>
                </View>
                {totalDurationMinutes > 0 && (
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
                  >
                    <Text style={{ color: "#fff", fontSize: 12 }}>
                      {totalDurationMinutes} phút
                    </Text>
                  </View>
                )}
                {isCurrentPlaylistPlaying && (
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: t.primary }}
                  >
                    <Text style={{ color: "#0E121B", fontSize: 12 }}>
                      Đang phát
                    </Text>
                  </View>
                )}
              </View>
            </LinearGradient>
          </View>

          <View
            className="flex flex-row justify-between items-center rounded-2xl p-5"
            style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            <View className="flex flex-row items-center gap-4">
              <Image
                className="rounded-full"
                style={{
                  backgroundColor: t.textMuted,
                  width: 48,
                  height: 48,
                }}
                source={{ uri: heroImage }}
              />
              <View className="gap-1">
                <Text style={{ color: t.text, fontWeight: "600" }}>
                  {tracks.length > 0
                    ? (tracks[0]?.artist ?? "Nghệ sĩ")
                    : "Chưa có bài hát"}
                </Text>
                <Text style={{ color: t.textMuted, fontSize: 13 }}>
                  Được tạo bởi bạn · {tracks.length} bài hát
                </Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity onPress={() => setIsLiked(!isLiked)}>
                <Heart
                  color={isLiked ? t.primary : t.text}
                  size={26}
                  fill={isLiked ? t.primary : "transparent"}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <CirclePlus color={t.text} size={26} strokeWidth={2} />
            </View>
          </View>

          <View className="flex flex-row gap-4 items-center">
            <LinearGradient
              colors={t.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 9999,
                paddingVertical: 16,
                paddingHorizontal: 26,
                shadowColor: t.primary,
                shadowOpacity: 0.45,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <TouchableOpacity
                onPress={handleTogglePlaylist}
                activeOpacity={isLoadingTrack ? 1 : 0.85}
                disabled={isLoadingTrack}
              >
                {isLoadingTrack ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : isCurrentPlaylistPlaying ? (
                  <View className="flex-row items-center gap-2">
                    <Pause color="#fff" size={22} fill="#fff" strokeWidth={0} />
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Tạm dừng
                    </Text>
                  </View>
                ) : (
                  <View className="flex-row items-center gap-2">
                    <Play color="#fff" size={22} fill="#fff" strokeWidth={0} />
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      Phát ngay
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </LinearGradient>
            <TouchableOpacity
              className="px-6 py-3 rounded-full border"
              style={{ borderColor: "rgba(255,255,255,0.2)" }}
            >
              <Text style={{ color: t.text, fontWeight: "600" }}>Chia sẻ</Text>
            </TouchableOpacity>
          </View>

          <View
            className="mt-6 rounded-3xl"
            style={{ backgroundColor: t.cardBg, padding: 18 }}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text
                className="font-bold"
                style={{ color: t.text, fontSize: 18, letterSpacing: 0.3 }}
              >
                Danh sách bài hát
              </Text>
              <Text style={{ color: t.textMuted, fontSize: 13 }}>
                Kéo lên để xem thêm
              </Text>
            </View>

            {tracks.length === 0 ? (
              <View className="items-center py-12 gap-2">
                <Text style={{ color: t.textMuted }}>
                  Playlist chưa có bài hát nào.
                </Text>
              </View>
            ) : (
              <FlatList
                data={tracks}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => openPlayer(item, index)}
                    activeOpacity={0.85}
                    className="mb-3"
                  >
                    <MusicCard item={item} variant="albumList" />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 6 }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default AlbumPlaylist;
