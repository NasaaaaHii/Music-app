import { CirclePlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SearchAPITracks } from "../../src/api/spotify";

type Track = {
  id: string;
  name: string;
  album: {
    images: {
      url: string;
    }[];
    artists: {
      name: string;
    }[];
  };
};

type Props = {
  searchContent: string;
};

export default function SearchMusicList({ searchContent }: Props) {
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>();

  async function LoadSearch(title: string, limit: number) {
    if(title.trim()==="") title = "a"
    setLoading(true);
    setTracks([]);

    const data = await SearchAPITracks(title, limit);
    setTracks(data);

    setLoading(false);
  }

  useEffect(() => {
    LoadSearch(searchContent as string, 50);
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
              source={{ uri: item.album.images[0].url }}
              style={{ width: 70, height: 70, borderRadius: 10 }}
            />
            <View className="flex-1 mx-3">
              <Text className="font-semibold text-base">{item.name}</Text>
              <Text className="text-sm text-gray-500">
                {item.album.artists.map((artist) => artist.name).join(", ")}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-1">
              <Pressable onPress={() => { alert(item.id) }}>
                <CirclePlus width={22} strokeWidth={1.5} />
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
}
