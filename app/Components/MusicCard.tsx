import { LinearGradient } from "expo-linear-gradient";
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
    image?: ImageSourcePropType | string;
    artist?: string;
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
  width?: number;
  imageHeight?: number;
};

export default function MusicCard({
  item,
  variant = "default",
  width = 40,
  imageHeight = 40,
}: MusicCardProps) {
  const [isFollow, setIsFollow] = useState(true);
  const raw = (item as any).image;
  const imageSource: ImageSourcePropType = {
    uri: raw,
  };

  if (variant == "artistsBoard") {
    return (
      <View className="bg-white rounded-2xl p-4 flex flex-row items-center justify-between border border-gray-200">
        <View className="flex flex-row items-center gap-4 flex-1">
          <Image
            className="rounded-full"
            source={imageSource}
            style={{
              backgroundColor: t.textMuted,
              width: width,
              height: imageHeight,
            }}
          />
          <View className="flex-1">
            <Text className="font-bold text-lg text-gray-900">
              {item.title}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {item.follow} người nghe
            </Text>
          </View>
        </View>
        {isFollow ? (
          <LinearGradient
            colors={t.buttonGradient ?? [t.primary, t.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 9999 }}
          >
            <TouchableOpacity
              className="px-6 py-2 rounded-full"
              onPress={() => setIsFollow(false)}
              activeOpacity={0.8}
            >
              <Text className="font-bold text-sm" style={{ color: "#001018" }}>
                Đang theo dõi
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            className="px-6 py-2 rounded-full border-2"
            onPress={() => setIsFollow(!isFollow)}
            activeOpacity={0.7}
          >
            <Text className="font-bold text-sm">Theo dõi</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
  if (variant == "albumList") {
    return (
      <View className="flex flex-row items-center gap-3">
        <Image
          source={imageSource}
          style={{ width: 56, height: 56, borderRadius: 8 }}
        />
        <View className="flex-1">
          <Text numberOfLines={1} style={{ color: t.text, fontWeight: "600" }}>
            {item.title}
          </Text>
          {!!item.artist && (
            <Text
              numberOfLines={1}
              style={{ color: t.textMuted, fontSize: 12 }}
            >
              {item.artist}
            </Text>
          )}
        </View>
      </View>
    );
  }
  if (variant === "withList") {
    return (
      <View
        className="mr-4 rounded-lg overflow-hidden"
        style={{ width: 140, backgroundColor: t.cardBg }}
      >
        <Image
          source={imageSource}
          style={{ width: 140, height: 140 }}
          resizeMode="cover"
        />
        <View style={{ padding: 8 }}>
          <Text style={{ color: t.text, fontWeight: "600" }} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={{ color: t.textMuted, fontSize: 12 }} numberOfLines={1}>
            {item.list || item.artist || ""}
          </Text>
        </View>
      </View>
    );
  }

  if (variant === "albumBoard") {
    return (
      <View
        className="mr-4 rounded-lg overflow-hidden"
        style={{ width: 120, backgroundColor: t.cardBg }}
      >
        <Image
          source={imageSource}
          style={{ width: 120, height: 120 }}
          resizeMode="cover"
        />
        <View style={{ padding: 6 }}>
          <Text
            style={{ color: t.text, fontSize: 13, fontWeight: "600" }}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          <Text style={{ color: t.textMuted, fontSize: 11 }} numberOfLines={1}>
            {(item.artist || "") + (item.year ? " • " + item.year : "")}
          </Text>
        </View>
      </View>
    );
  }
}
