import { router } from "expo-router";
import { Heart, Pause, Play } from "lucide-react-native";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useMusic } from "../Context/MusicContext";
import { t } from "../theme";
export default function MiniPlayerSong() {
  const { currentTrack, isPlaying, setIsPlaying } = useMusic();
  const [isLiked, setIsLiked] = useState(false);
  const [progress, setProgress] = useState(12);
  if (!currentTrack) return;
  const handleOpenFullPlayer = () => {
    router.push("/Player");
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handleOpenFullPlayer}
      className="bg-neutral-600 rounded-xl overflow-hidden mx-2 my-10"
    >
      <View className="p-2 flex flex-row justify-between gap-4">
        <View className="flex flex-row items-center gap-4">
          <Image
            className="rounded-lg"
            style={{ width: 50, height: 50 }}
            resizeMode="cover"
            source={{ uri: currentTrack.image }}
          />

          <View className="flex flex-col gap-1">
            <Text className="text-[12px] font-bold text-white">
              {currentTrack.title}
            </Text>
            <Text className="text-[10px] text-white font-normal">
              {currentTrack.artist}
            </Text>
          </View>
        </View>
        <View className="flex flex-row items-center gap-4">
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            activeOpacity={0.7}
          >
            <Heart
              size={24}
              color={isLiked ? "#ef4444" : "white"}
              fill={isLiked ? "#ef4444" : "none"}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              setIsPlaying(!isPlaying);
            }}
            activeOpacity={0.7}
            className="bg-white p-2 rounded-full"
            style={{ backgroundColor: t.primary }}
          >
            {isPlaying ? (
              <Pause color="#000" size={20} fill="#000" />
            ) : (
              <Play color="#000" size={20} fill="#000" />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View className="h-1 bg-gray-200 mx-2">
        <View
          className="h-full"
          style={{ width: `${progress}%`, backgroundColor: t.primaryDark }}
        />
      </View>
    </TouchableOpacity>
  );
}
