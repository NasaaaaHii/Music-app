import { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
type MusicCardProps = {
  item: {
    id: string;
    title: string;
    image?: ImageSourcePropType;
    img?: ImageSourcePropType;
    list?: string;
    artist?: string;
    year?: string;
    follow?: string;
  };
  variant?: "default" | "withList" | "album" | "artists";
  width?: string;
  imageHeight?: string;
};

export default function MusicCard({
  item,
  variant = "default",
  width = "w-40",
  imageHeight = "h-40",
}: MusicCardProps) {
  const imageSource = item.image || item.img;
  const [isFollow, setIsFollow] = useState(true);
  if (variant == "artists") {
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

        {variant === "album" && (
          <Text className="text-gray-500 text-xs mt-1">
            {item.artist} • {item.year}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
