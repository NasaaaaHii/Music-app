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
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useMusic } from "./Context/MusicContext";
import { t } from "./theme";

const Player = () => {
  const { currentTrack, isPlaying, setIsPlaying } = useMusic();
  return (
    <ScrollView className="flex-1" style={{ backgroundColor: t.cardBg }}>
      <View className="px-4 pb-8 pt-8">
        <View className="flex flex-row justify-between gap-4 items-center">
          <TouchableOpacity
            className="rounded-full"
            onPress={() => router.back()}
          >
            <ChevronDown color={t.text} />
          </TouchableOpacity>

          <View className="flex flex-col gap-1 items-center">
            <Text
              style={{ color: t.textMuted, fontSize: 14, letterSpacing: 0.2 }}
            >
              Đang phát từ danh sách phát
            </Text>
            <Text
              style={{
                color: t.text,
                fontWeight: "700",
                fontSize: 16,
                letterSpacing: 0.3,
              }}
            >
              {currentTrack?.title}
            </Text>
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
          <Image
            className="rounded-lg"
            style={{ width: 200, height: 200 }}
            resizeMode="cover"
            source={{ uri: currentTrack?.image }}
          />
        </View>

        <View className="mt-16 flex flex-row justify-between gap-2 px-2">
          <View>
            <Text
              style={{
                color: t.text,
                fontWeight: "700",
                fontSize: 22,
                letterSpacing: 0.2,
              }}
            >
              {currentTrack?.title}
            </Text>
            <Text style={{ color: t.textMuted, fontSize: 16 }}>
              {currentTrack?.artist}
            </Text>
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
          <View
            style={{
              height: 4,
              width: "100%",
              backgroundColor: t.tabBarBorder,
              borderRadius: 999,
              position: "relative",
            }}
          >
            <View
              style={{
                backgroundColor: t.primary,
                width: 2,
                height: 8,
                borderRadius: 999,
                position: "absolute",
                top: -2,
              }}
            />
          </View>
          <View className="flex flex-row justify-between pt-2">
            <Text style={{ color: t.textMuted, fontSize: 12 }}>0:00</Text>
            <Text style={{ color: t.textMuted, fontSize: 12 }}>2:30</Text>
          </View>
        </View>

        <View className="flex flex-row justify-between gap-3 mt-10 items-center">
          <TouchableOpacity>
            <Repeat color={t.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity>
            <SkipBack color={t.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-5 rounded-full"
            style={{ backgroundColor: t.primary }}
            onPress={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause
                color="#001018"
                fill="#001018"
                size={24}
                strokeWidth={2.5}
              />
            ) : (
              <Play
                color="#001018"
                fill="#001018"
                size={24}
                strokeWidth={2.5}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity>
            <SkipForward color={t.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Timer color={t.text} size={24} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View className="mt-10">
          {/* <MusicCard
             item={artistData}
            variant="artistsBoard"
            width={40}
            imageHeight={40}
          /> */}
        </View>
      </View>
    </ScrollView>
  );
};

export default Player;
