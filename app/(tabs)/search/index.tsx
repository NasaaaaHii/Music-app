import { LinearGradient } from "expo-linear-gradient";
import { BellRing, Mic, Play, Search, Settings, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import searchBUS from "../../../backend/BUS/searchBUS";
import { useMusic } from "../../Context/MusicContext";
import { t } from "../../theme";

type SearchResult = {
  id: string;
  track_id: number;
  title: string;
  artists: string[];
  image: string;
};

export default function SearchMusic() {
  const [dimensions, setDimensions] = useState(Dimensions.get("window"));
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [loadingTrackId, setLoadingTrackId] = useState<string | null>(null);
  const [trendingTracks, setTrendingTracks] = useState<SearchResult[]>([]);
  const [trendingTracksLoading, setTrendingTracksLoading] = useState(true);
  const [trendingTrackError, setTrendingTrackError] = useState<string | null>(
    null
  );
  const [trendingPlaylists, setTrendingPlaylists] = useState<
    { id: string; title: string; image: string }[]
  >([]);
  const [trendingPlaylistsLoading, setTrendingPlaylistsLoading] =
    useState(true);
  const [trendingPlaylistsError, setTrendingPlaylistsError] = useState<
    string | null
  >(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentRequestRef = useRef<{
    trackId: string;
    cancelled: boolean;
  } | null>(null);
  const {
    setCurrentTrack,
    isLoadingTrack,
    currentTrack,
    playlist,
    currentIndex,
  } = useMusic();
  const filterButton = ["New Music", "Top", "Trending", "Podcast"];
  const [activeFilter, setActiveFilter] = React.useState("New Music");

  const accentPairs = [
    ["#34D399", "#059669"],
    ["#60A5FA", "#2563EB"],
    ["#F472B6", "#DB2777"],
    ["#FBBF24", "#D97706"],
    ["#A78BFA", "#7C3AED"],
  ];
  const getAccentPair = (index: number) =>
    accentPairs[index % accentPairs.length];

  const isWeb = Platform.OS === "web";
  const isTablet = dimensions.width >= 768;
  const isDesktop = dimensions.width >= 1024;
  const contentHorizontalPadding = isWeb
    ? isDesktop
      ? 40
      : isTablet
        ? 32
        : 20
    : 16;

  const getFilteredTrendingTracks = () => {
    if (!trendingTracks.length) return [];

    switch (activeFilter) {
      case "New Music":
        return trendingTracks.slice(0, 5);
      case "Top":
        return [...trendingTracks].reverse().slice(0, 6);
      case "Trending":
        return trendingTracks;
      case "Podcast":
        return trendingTracks
          .filter(
            (track) => track.title.length > 30 || track.artists.length > 1
          )
          .slice(0, 4);
      case "Free":
        return trendingTracks.slice(2, 7);
      default:
        return trendingTracks;
    }
  };

  const filteredTrendingTracks = getFilteredTrendingTracks();

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const fetchTrendingTracks = async () => {
      try {
        setTrendingTracksLoading(true);
        setTrendingTrackError(null);
        const data = await searchBUS.getTrendingTracks(10, "week");
        setTrendingTracks(data);
      } catch (error) {
        console.error("Error fetching trending tracks:", error);
        setTrendingTrackError("Không thể tải danh sách phổ biến");
        setTrendingTracks([]);
      } finally {
        setTrendingTracksLoading(false);
      }
    };

    const fetchTrendingPlaylists = async () => {
      try {
        setTrendingPlaylistsLoading(true);
        setTrendingPlaylistsError(null);
        const data = await searchBUS.getTrendingPlaylists();
        setTrendingPlaylists(data);
      } catch (error) {
        console.error("Error fetching trending playlists:", error);
        setTrendingPlaylistsError("Không thể tải danh sách xu hướng");
        setTrendingPlaylists([]);
      } finally {
        setTrendingPlaylistsLoading(false);
      }
    };

    fetchTrendingTracks();
    fetchTrendingPlaylists();
  }, []);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      console.log("Searching for:", query);
      const res = await searchBUS.searchTracks(query, 20);
      setSearchResults(res);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch(searchQuery);
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  const handlePlayTrack = async (track: SearchResult) => {
    if (currentRequestRef.current) {
      currentRequestRef.current.cancelled = true;
    }

    const requestId = track.id;
    currentRequestRef.current = { trackId: requestId, cancelled: false };
    setLoadingTrackId(requestId);

    try {
      const streamUrl = await searchBUS.getTrackStreamUrl(track.track_id);
      if (
        currentRequestRef.current?.cancelled ||
        currentRequestRef.current?.trackId !== requestId
      ) {
        console.log("Request cancelled for track:", track.title);
        return;
      }

      const trackData = {
        id: track.id,
        title: track.title,
        artist: track.artists.join(", "),
        image: track.image,
      };

      await setCurrentTrack(
        trackData,
        searchResults.map((t) => ({
          id: t.id,
          title: t.title,
          artist: t.artists.join(", "),
          image: t.image,
          track_id: t.track_id,
        })),
        searchResults.findIndex((t) => t.id === track.id),
        streamUrl,
        0
      );
    } catch (error) {
      if (
        !currentRequestRef.current?.cancelled &&
        currentRequestRef.current?.trackId === requestId
      ) {
        console.error("Error playing track:", error);
        alert("Không thể phát bài hát này");
      }
    } finally {
      if (currentRequestRef.current?.trackId === requestId) {
        setLoadingTrackId(null);
        currentRequestRef.current = null;
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setHasSearched(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: t.surface,
        paddingHorizontal: contentHorizontalPadding,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: isWeb && isDesktop ? 24 : 16,
          paddingBottom: isWeb && isDesktop ? 16 : 10,
        }}
      >
        <Text
          className={`font-semibold ${
            isWeb && isDesktop ? "text-3xl" : "text-[25px]"
          }`}
          style={{ color: t.text }}
        >
          Search
        </Text>
        <View className="flex flex-row gap-6">
          <BellRing color={t.text} size={isWeb && isDesktop ? 24 : 20} />
          <Settings color={t.text} size={isWeb && isDesktop ? 24 : 20} />
        </View>
      </View>
      <View
        className={`flex flex-row items-center ${
          isWeb && isDesktop ? "mt-5" : "mt-3"
        }`}
      >
        <View
          className="absolute left-3 z-10"
          style={{ paddingLeft: isWeb && isDesktop ? 20 : 12 }}
        >
          <Search color={t.textMuted} size={isWeb && isDesktop ? 26 : 22} />
        </View>
        <TextInput
          placeholder="Tìm kiếm bài hát, nghệ sĩ..."
          placeholderTextColor={t.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
          className={`flex-1 rounded-full ${
            isWeb && isDesktop ? "px-16 py-4 text-lg" : "px-12 py-3"
          }`}
          style={{
            backgroundColor: t.cardBg,
            color: t.text,
            borderWidth: 2,
            borderColor: searchQuery ? t.primary : t.tabBarBorder,
            shadowColor: searchQuery ? t.primary : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: searchQuery ? 0.2 : 0.1,
            shadowRadius: 6,
            elevation: searchQuery ? 4 : 3,
          }}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={clearSearch}
            className="absolute right-12 z-10"
            style={{ paddingRight: isWeb && isDesktop ? 20 : 12 }}
          >
            <X color={t.textMuted} size={isWeb && isDesktop ? 22 : 18} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className="absolute right-3 z-10"
          style={{ paddingRight: isWeb && isDesktop ? 20 : 12 }}
        >
          <Mic color={t.primary} size={isWeb && isDesktop ? 26 : 22} />
        </TouchableOpacity>
      </View>

      {!hasSearched && (
        <View
          className={`flex flex-row flex-wrap ${
            isWeb && isDesktop ? "mt-6 gap-3" : "mt-4 gap-2"
          }`}
        >
          {filterButton.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveFilter(item)}
              className="overflow-hidden"
              style={{
                borderRadius: 9999,
                shadowColor: activeFilter === item ? t.primary : "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: activeFilter === item ? 0.3 : 0.1,
                shadowRadius: 6,
                elevation: activeFilter === item ? 4 : 2,
              }}
            >
              {activeFilter === item ? (
                <LinearGradient
                  colors={t.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className={`rounded-full ${
                    isWeb && isDesktop ? "px-4 py-2" : "px-3 py-1"
                  }`}
                >
                  <Text
                    className={`${
                      isWeb && isDesktop ? "text-base" : "text-sm"
                    } font-semibold`}
                    style={{ color: t.surface }}
                  >
                    {item}
                  </Text>
                </LinearGradient>
              ) : (
                <View
                  className={`rounded-full ${
                    isWeb && isDesktop ? "px-4 py-2" : "px-3 py-1"
                  }`}
                  style={{
                    backgroundColor: t.cardBg,
                    borderWidth: 1.5,
                    borderColor: t.tabBarBorder,
                  }}
                >
                  <Text
                    className={`${
                      isWeb && isDesktop ? "text-base" : "text-sm"
                    } font-semibold`}
                    style={{ color: t.text }}
                  >
                    {item}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView
        className={isWeb && isDesktop ? "mt-8" : "mt-6"}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isWeb ? (isDesktop ? 200 : 160) : 140,
        }}
      >
        {loading && (
          <View className="flex items-center justify-center py-20">
            <ActivityIndicator size="large" color={t.primary} />
            <Text className="mt-4 text-base" style={{ color: t.textMuted }}>
              Đang tìm kiếm...
            </Text>
          </View>
        )}

        {!loading && hasSearched && searchResults.length === 0 && (
          <View className="flex items-center justify-center py-20">
            <Text className="text-2xl mb-2" style={{ color: t.textMuted }}>
              😔
            </Text>
            <Text
              className="text-lg font-semibold mb-1"
              style={{ color: t.text }}
            >
              Không tìm thấy kết quả
            </Text>
            <Text className="text-sm" style={{ color: t.textMuted }}>
              Thử tìm kiếm với từ khóa khác
            </Text>
          </View>
        )}

        {!loading && hasSearched && searchResults.length > 0 && (
          <View>
            <Text
              className={`font-bold mb-4 ${
                isWeb && isDesktop ? "text-2xl" : "text-xl"
              }`}
              style={{ color: t.text }}
            >
              Kết quả tìm kiếm ({searchResults.length})
            </Text>
            <FlatList
              scrollEnabled={false}
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                const [accentStart, accentEnd] = getAccentPair(index);
                const isLoadingItem =
                  loadingTrackId === item.id ||
                  (isLoadingTrack && currentTrack?.id === item.id);
                return (
                  <LinearGradient
                    colors={[`${accentStart}40`, `${accentEnd}30`]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 22,
                      padding: 1,
                      marginBottom: 14,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => handlePlayTrack(item)}
                      disabled={isLoadingItem}
                      activeOpacity={isLoadingItem ? 1 : 0.85}
                      style={{
                        backgroundColor: t.cardBg,
                        borderRadius: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        padding: 14,
                        gap: 14,
                      }}
                    >
                      <Image
                        source={{ uri: item.image }}
                        className="w-14 h-14 rounded-xl"
                      />
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            color: t.text,
                            fontSize: 16,
                            fontWeight: "600",
                          }}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>
                        <Text
                          style={{ color: t.textMuted, marginTop: 4 }}
                          numberOfLines={1}
                        >
                          {item.artists.join(", ")}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handlePlayTrack(item)}
                        disabled={isLoadingItem}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: accentStart,
                          justifyContent: "center",
                          alignItems: "center",
                          opacity: isLoadingItem ? 0.6 : 1,
                        }}
                      >
                        {isLoadingItem ? (
                          <ActivityIndicator size="small" color="#0B0F1F" />
                        ) : (
                          <Play color="#0B0F1F" size={20} fill="#0B0F1F" />
                        )}
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </LinearGradient>
                );
              }}
            />
          </View>
        )}

        {!hasSearched && !loading && (
          <>
            <View
              className={`flex flex-row justify-between items-center ${
                isWeb && isDesktop ? "mb-5" : "mb-3"
              }`}
            >
              <Text
                className={`font-semibold ${
                  isWeb && isDesktop ? "text-xl" : "text-base"
                }`}
                style={{ color: t.text }}
              >
                {activeFilter === "New Music"
                  ? "Bài hát mới"
                  : activeFilter === "Top"
                    ? "Top bài hát"
                    : activeFilter === "Trending"
                      ? "Xu hướng"
                      : activeFilter === "Podcast"
                        ? "Podcast"
                        : activeFilter === "Free"
                          ? "Miễn phí"
                          : "Bài hát phổ biến"}
              </Text>
            </View>
            {trendingTracksLoading ? (
              <View className="py-6 flex flex-row items-center gap-3">
                <ActivityIndicator size="small" color={t.primary} />
                <Text style={{ color: t.textMuted }}>Đang tải dữ liệu...</Text>
              </View>
            ) : trendingTrackError ? (
              <Text style={{ color: t.textMuted, marginBottom: 12 }}>
                {trendingTrackError}
              </Text>
            ) : filteredTrendingTracks.length === 0 ? (
              <Text style={{ color: t.textMuted, marginBottom: 12 }}>
                Không có dữ liệu cho bộ lọc này
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 12,
                  paddingRight: contentHorizontalPadding,
                }}
              >
                {filteredTrendingTracks.map((song, index) => {
                  const [accentStart, accentEnd] = getAccentPair(index);
                  return (
                    <TouchableOpacity
                      key={song.id}
                      activeOpacity={0.85}
                      onPress={() => handlePlayTrack(song)}
                      style={{
                        width: 220,
                        borderRadius: 24,
                        marginRight: 16,
                        overflow: "hidden",
                        backgroundColor: t.cardBg,
                      }}
                    >
                      <Image
                        source={{ uri: song.image }}
                        style={{ width: "100%", height: 150 }}
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={[`${accentStart}35`, `${accentEnd}35`]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ padding: 14 }}
                      >
                        <Text
                          style={{
                            color: t.text,
                            fontWeight: "600",
                            fontSize: 15,
                          }}
                          numberOfLines={1}
                        >
                          {song.title}
                        </Text>
                        <Text
                          style={{ color: t.textMuted, marginTop: 4 }}
                          numberOfLines={1}
                        >
                          {song.artists.join(", ")}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <Text
              className={`font-semibold mt-6 mb-3 ${
                isWeb && isDesktop ? "text-xl" : "text-lg"
              }`}
              style={{ color: t.text }}
            >
              Hot & Trending
            </Text>
            {trendingPlaylistsLoading ? (
              <View className="py-6 flex flex-row items-center gap-3">
                <ActivityIndicator size="small" color={t.primary} />
                <Text style={{ color: t.textMuted }}>Đang tải playlist...</Text>
              </View>
            ) : trendingPlaylistsError ? (
              <Text style={{ color: t.textMuted, marginBottom: 12 }}>
                {trendingPlaylistsError}
              </Text>
            ) : trendingPlaylists.length === 0 ? (
              <Text style={{ color: t.textMuted, marginBottom: 12 }}>
                Không có playlist nổi bật
              </Text>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingRight: contentHorizontalPadding,
                }}
              >
                {trendingPlaylists.map((item, index) => {
                  const [accentStart, accentEnd] = getAccentPair(index + 2);
                  return (
                    <TouchableOpacity
                      key={item.id}
                      className="mr-3 rounded-3xl overflow-hidden"
                      style={{
                        width: 180,
                        height: 180,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 6,
                      }}
                      activeOpacity={0.85}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={{ width: "100%", height: "100%" }}
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={[
                          "rgba(0,0,0,0.8)",
                          `${accentStart}30`,
                          "transparent",
                        ]}
                        start={{ x: 0, y: 1 }}
                        end={{ x: 0, y: 0 }}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: 12,
                        }}
                      >
                        <Text
                          numberOfLines={2}
                          style={{
                            color: "#fff",
                            fontWeight: "700",
                            lineHeight: 18,
                          }}
                        >
                          {item.title}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
