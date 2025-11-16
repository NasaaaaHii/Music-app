import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ChevronDown,
  CirclePlus,
  Ellipsis,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Timer,
  X,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import MarqueeText from "./Components/MarqueeText";
import { useMusic } from "./Context/MusicContext";
import { t } from "./theme";

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    url,
    process,
    duration,
    handleSeek,
    play,
    pause,
    isLoadingTrack,
    nextTrack,
    prevTrack,
    hasNextTrack,
    hasPrevTrack,
  } = useMusic();
  const sliderRef = useRef<View>(null);
  const [sliderWidth, setSliderWidth] = useState(0);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) {
      return "00:00";
    }
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        if (sliderWidth > 0 && duration) {
          const newValue = Math.max(
            0,
            Math.min(
              duration,
              (evt.nativeEvent.locationX / sliderWidth) * duration
            )
          );
          handleSeek(newValue);
        }
      },
      onPanResponderMove: (evt) => {
        if (sliderWidth > 0 && duration) {
          const newValue = Math.max(
            0,
            Math.min(
              duration,
              (evt.nativeEvent.locationX / sliderWidth) * duration
            )
          );
          handleSeek(newValue);
        }
      },
    })
  ).current;

  const progressPercentage = duration > 0 ? (process / duration) * 100 : 0;
  const showProgressBar = duration > 0 || isLoadingTrack;
  console.log(duration);
  return (
    <LinearGradient
      colors={t.heroGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView className="flex-1" style={{ backgroundColor: "transparent" }}>
        <View className="px-4 pb-8 pt-8">
          <View className="flex flex-row justify-between gap-4 items-center">
            <TouchableOpacity
              className="rounded-full"
              onPress={() => router.back()}
            >
              <ChevronDown color={t.text} />
            </TouchableOpacity>

            <View
              className="flex flex-col gap-1 items-center"
              style={{ flex: 1, maxWidth: "60%", minWidth: 0 }}
            >
              <Text
                style={{ color: t.textMuted, fontSize: 14, letterSpacing: 0.2 }}
              >
                Đang phát từ danh sách phát
              </Text>
              <MarqueeText
                style={{
                  color: t.text,
                  fontWeight: "700",
                  fontSize: 16,
                  letterSpacing: 0.3,
                }}
                speed={30}
                delay={2000}
              >
                {currentTrack?.title || ""}
              </MarqueeText>
            </View>

            <TouchableOpacity className="rounded-full">
              <Ellipsis
                color={t.textMuted}
                style={{ transform: [{ rotate: "90deg" }] }}
                size={24}
              />
            </TouchableOpacity>
          </View>

          <View className="mt-16 flex items-center px-2">
            <View
              style={{
                shadowColor: t.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 15,
              }}
            >
              <Image
                className="rounded-2xl"
                style={{ width: 200, height: 200 }}
                resizeMode="cover"
                source={{ uri: currentTrack?.image }}
              />
            </View>
          </View>

          <View className="mt-16 flex flex-row justify-between gap-2 px-2">
            <View style={{ flex: 1, marginRight: 8, minWidth: 0 }}>
              <MarqueeText
                style={{
                  color: t.text,
                  fontWeight: "700",
                  fontSize: 22,
                  letterSpacing: 0.2,
                }}
                speed={30}
                delay={2000}
              >
                {currentTrack?.title || ""}
              </MarqueeText>
              <MarqueeText
                style={{ color: t.textMuted, fontSize: 16, marginTop: 4 }}
                speed={30}
                delay={2000}
              >
                {currentTrack?.artist || ""}
              </MarqueeText>
            </View>
            <View className="flex flex-row gap-1">
              <TouchableOpacity className="p-3 rounded-full">
                <X color={t.text} size={30} strokeWidth={2.5} />
              </TouchableOpacity>
              <TouchableOpacity className="p-3 rounded-full">
                <CirclePlus color={t.text} size={30} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="px-2 mt-8 flex flex-col">
            <View className="flex items-center gap-2 w-full relative justify-between">
              <Text
                className="text-xs w-10 text-right absolute left-0 top-3"
                style={{ color: t.text }}
              >
                {formatTime(process)}
              </Text>

              <View
                ref={sliderRef}
                onLayout={(event) => {
                  setSliderWidth(event.nativeEvent.layout.width);
                }}
                className="flex-1 w-full h-2 rounded-full relative overflow-hidden"
                style={{
                  backgroundColor: t.cardHover,
                  minHeight: 8,
                }}
                {...panResponder.panHandlers}
              >
                <View
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    backgroundColor: t.cardHover,
                    borderRadius: 9999,
                  }}
                />

                {showProgressBar && (
                  <LinearGradient
                    colors={t.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                      height: "100%",
                      width: `${Math.max(0, Math.min(100, progressPercentage))}%`,
                      borderRadius: 9999,
                      position: "absolute",
                      zIndex: 1,
                    }}
                  />
                )}

                {isLoadingTrack && duration === 0 && (
                  <View
                    style={{
                      position: "absolute",
                      width: "30%",
                      height: "100%",
                      backgroundColor: t.primary + "40",
                      borderRadius: 9999,
                      left: "35%",
                    }}
                  />
                )}

                {duration > 0 && (
                  <View
                    className="absolute rounded-full"
                    style={{
                      width: 16,
                      height: 16,
                      backgroundColor: t.primary,
                      left: `${Math.max(0, Math.min(100, progressPercentage))}%`,
                      top: -6,
                      marginLeft: -8,
                      shadowColor: t.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.5,
                      shadowRadius: 4,
                      elevation: 4,
                      zIndex: 2,
                    }}
                  />
                )}
              </View>

              <Text
                className="text-xs w-10 absolute right-0 top-3"
                style={{ color: t.text }}
              >
                {formatTime(duration)}
              </Text>
            </View>
          </View>

          <View className="flex flex-row justify-between gap-3 mt-10 items-center">
            <TouchableOpacity>
              <Repeat color={t.text} size={24} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={prevTrack}
              disabled={!hasPrevTrack || isLoadingTrack}
              style={{ opacity: hasPrevTrack ? 1 : 0.5 }}
            >
              <SkipBack
                color={hasPrevTrack ? t.text : t.textMuted}
                size={24}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-5 rounded-full overflow-hidden"
              style={{
                shadowColor: t.primary,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.5,
                shadowRadius: 16,
                elevation: 12,
                opacity: isLoadingTrack ? 0.6 : 1,
              }}
              disabled={isLoadingTrack}
              onPress={() => {
                if (isLoadingTrack) return;
                if (isPlaying) {
                  pause();
                } else {
                  play();
                }
              }}
            >
              <LinearGradient
                colors={t.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isLoadingTrack ? (
                  <ActivityIndicator size="small" color={t.surface} />
                ) : isPlaying ? (
                  <Pause
                    color={t.surface}
                    fill={t.surface}
                    size={24}
                    strokeWidth={2.5}
                  />
                ) : (
                  <Play
                    color={t.surface}
                    fill={t.surface}
                    size={24}
                    strokeWidth={2.5}
                  />
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={nextTrack}
              disabled={!hasNextTrack || isLoadingTrack}
              style={{ opacity: hasNextTrack ? 1 : 0.5 }}
            >
              <SkipForward
                color={hasNextTrack ? t.text : t.textMuted}
                size={24}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Timer color={t.text} size={24} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default Player;
