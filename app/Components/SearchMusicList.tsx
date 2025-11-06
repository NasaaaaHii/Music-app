import { CirclePlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { searchTrackAPI } from "../../config/musicApi";

type Track = {
  id: string;
  track_id: number;
  title: string;
  user?: { name: string };
  artists?: { name: string }[];

  access: {
    download: true;
    stream: true;
  }[];

  artwork: {
    "150x150": string | null;
    "480x480": string | null;
    "1000x1000": string | null;
    images: {
      url: string;
    }[];
  };
};

type Props = {
  searchContent: string;
};

export default function SearchMusicList({ searchContent }: Props) {
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>();

  async function LoadSearch(title: string) {
    setLoading(true);
    setTracks([]);

    const data = await searchTrackAPI(title);
    setTracks(data.data);
    setLoading(false);
  }

  useEffect(() => {
    LoadSearch(searchContent as string);
  }, [searchContent]);

  
  return (
    <View>
      {loading && (
        <Text className="text-gray-400 text-center">Đang tải bài hát...</Text>
      )}
      <FlatList
        scrollEnabled={false}
        data={tracks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 20,
          paddingVertical: 0,
        }}
        renderItem={({ item }) => (
          <View className="flex flex-row items-center">
            <Image
              source={{
                uri:
                  item.artwork?.["1000x1000"] ||
                  item.artwork?.["480x480"] ||
                  item.artwork?.["150x150"] ||
                  "https://cdn-icons-png.flaticon.com/512/727/727245.png",
              }}
              style={{ width: 70, height: 70, borderRadius: 10 }}
            />
            <View className="flex-1 mx-3">
              <Text className="font-semibold text-base">{item.title}</Text>
              <Text className="text-sm text-gray-500">
                {item.artists && item.artists.length > 0
                  ? item.artists.map((a) => a.name).join(", ")
                  : item.user?.name || "Unknown Artist"}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-1">
              <Pressable
                onPress={() => {
                  alert(item.id);
                }}
              >
                <CirclePlus width={22} strokeWidth={1.5} />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
