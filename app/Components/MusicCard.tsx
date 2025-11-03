import { LinearGradient } from "expo-linear-gradient";
import { Ellipsis } from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { t } from "../theme";
type MusicCardProps = {
  item: {
    id: string;
    title: string;
    image?: ImageSourcePropType;
    list?: string;
    year?: string;
    follow?: string;
    musicArtist?: string[];
    slogan?: string;
  };
  variant?:
    | "default"
    | "withList"
    | "albumBoard"
    | "artistsBoard"
    | "albumList";
  width?: string;
  imageHeight?: string;
};

export default function MusicCard({
  item,
  variant = "default",
  width = "w-40",
  imageHeight = "h-40",
}: MusicCardProps) {
  const imageSource = item.image;
  const [isFollow, setIsFollow] = useState(true);
  if (variant == "artistsBoard") {
    return (
      <View className="bg-white rounded-2xl p-4 flex flex-row items-center justify-between border border-gray-200">
        <View className="flex flex-row items-center gap-4 flex-1">
          <Image className="w-16 h-16 rounded-full" source={imageSource} />
          <View className="flex-1">
            <Text className="font-bold text-lg text-gray-900">
              {item.title}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {item.follow} người nghe
            </Text>
          </View>
        </View>
        <TouchableOpacity
          className={`px-6 py-2 rounded-full border-2 ${isFollow ? "bg-gray-900 border-gray-900" : "bg-white border-gray-900"}`}
          onPress={() => setIsFollow(!isFollow)}
          activeOpacity={0.7}
        >
          <Text
            className={`font-bold text-sm ${isFollow ? "text-white" : "text-gray-900"}`}
          >
            {isFollow ? "Đang theo dõi" : "Theo dõi"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (variant == "albumList") {
    return (
      <TouchableOpacity activeOpacity={0.7}>
        <LinearGradient
          colors={t.heroGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0 }}
          style={{
            borderRadius: 12,
            padding: 12,
          }}
        >
          <View className="flex flex-row gap-3 items-center">
            <Image className="h-14 w-14 rounded-lg" source={imageSource} />
            <View className="flex-1 flex flex-col gap-1">
              <Text className="font-bold text-base" style={{ color: t.text }}>
                {item.title}
              </Text>
              <Text className="text-sm" style={{ color: t.textMuted }}>
                {item.musicArtist?.join(", ")}
              </Text>
            </View>
            <TouchableOpacity className="p-2">
              <Ellipsis
                style={{ transform: [{ rotate: "90deg" }] }}
                size={20}
                color={t.textMuted}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={`mr-4 ${width} rounded-lg bg-gray-100 overflow-hidden`}
    >
      <Image source={imageSource} className={`w-full ${imageHeight}`} />
      <View className="p-3">
        <Text className="font-semibold text-gray-900 text-sm" numberOfLines={1}>
          {item.title}
        </Text>
        {variant === "withList" && item.list && (
          <Text className="text-gray-500 text-xs mt-1">{item.list}</Text>
        )}

        {variant === "albumBoard" && (
          <Text className="text-gray-500 text-xs mt-1">
            {item.year} • {item.year}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
