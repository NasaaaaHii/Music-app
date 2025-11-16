import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Heart, Pause, Play } from "lucide-react-native";
import { useRef, useState } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { useMusic } from "../Context/MusicContext";
import { t } from "../theme";
import MarqueeText from "./MarqueeText";

export default function MiniPlayerSong() {
  const [isLiked, setIsLiked] = useState(false);
  const [isHandlingPlayPause, setIsHandlingPlayPause] = useState(false);
  const playPauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const {
    currentTrack,
    play,
    pause,
    isPlaying,
    process,
    duration,
    isLoadingTrack,
  } = useMusic();

  if (!currentTrack) return null;

  const progressPercentage = duration > 0 ? (process / duration) * 100 : 0;

  const handlePlayPause = async (e: any) => {
    e.stopPropagation();

    if (isHandlingPlayPause || isLoadingTrack) return;

    setIsHandlingPlayPause(true);

    if (playPauseTimeoutRef.current) {
      clearTimeout(playPauseTimeoutRef.current);
    }

    try {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } catch (error) {
      console.error("Error in play/pause:", error);
    } finally {
      playPauseTimeoutRef.current = setTimeout(() => {
        setIsHandlingPlayPause(false);
      }, 300);
    }
  };
  const handleOpenFullPlayer = () => {
    router.push("/Player");
  };
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleOpenFullPlayer}
      className="rounded-2xl overflow-hidden mx-2 my-10"
      style={{
        backgroundColor: t.cardBg,
        shadowColor: t.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <View className="p-2 flex flex-row justify-between gap-4">
        <View
          className="flex flex-row items-center gap-4"
          style={{ flex: 1, minWidth: 0 }}
        >
          <Image
            className="rounded-lg"
            style={{ width: 50, height: 50 }}
            resizeMode="cover"
            source={{ uri: currentTrack.image }}
          />

          <View
            className="flex flex-col gap-1"
            style={{ flex: 1, minWidth: 0 }}
          >
            <MarqueeText
              style={{ color: t.text, fontSize: 12, fontWeight: "700" }}
              speed={40}
              delay={1500}
            >
              {currentTrack.title}
            </MarqueeText>
            <MarqueeText
              style={{ color: t.textMuted, fontSize: 10 }}
              speed={40}
              delay={1500}
            >
              {currentTrack.artist}
            </MarqueeText>
          </View>
        </View>
        <View
          className="flex flex-row items-center gap-4"
          style={{ flexShrink: 0 }}
        >
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            activeOpacity={0.7}
          >
            <Heart
              size={24}
              color={isLiked ? t.primary : t.text}
              fill={isLiked ? t.primary : "transparent"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePlayPause}
            disabled={isLoadingTrack || isHandlingPlayPause}
            activeOpacity={isLoadingTrack || isHandlingPlayPause ? 1 : 0.7}
            className="p-2 rounded-full overflow-hidden"
            style={{
              shadowColor: t.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.4,
              shadowRadius: 6,
              elevation: 4,
              opacity: isLoadingTrack || isHandlingPlayPause ? 0.6 : 1,
            }}
          >
            <LinearGradient
              colors={t.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isLoadingTrack || isHandlingPlayPause ? (
                <ActivityIndicator size="small" color={t.surface} />
              ) : isPlaying ? (
                <Pause color={t.surface} size={20} fill={t.surface} />
              ) : (
                <Play color={t.surface} size={20} fill={t.surface} />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <View
        className="h-1.5 mx-2 rounded-full overflow-hidden mb-2"
        style={{ backgroundColor: t.cardHover }}
      >
        <LinearGradient
          colors={t.buttonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: "100%",
            width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
            borderRadius: 9999,
          }}
        />
      </View>
    </TouchableOpacity>
  );
}
