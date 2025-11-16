import { CheckCheck, CirclePlus } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  DeviceEventEmitter,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";
import playlistBUS from "../../backend/BUS/playlistBUS";
import { searchTrackAPI } from "../../config/musicApi";

type Props = {
  searchContent: string;
  uid: string;
  plid: string;
};

type Track = {
  id: string;
  track_id: number;
  title: string;
  artists: string[];
  is_inPlayList: boolean;
  access?: {
    download?: boolean;
    stream?: boolean;
  };
  image: string;
};

export default function SearchMusicList({ searchContent, uid, plid }: Props) {
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState<Track[]>();
  const [DBPlaylist, setDBPlaylist] = useState<any>();

  async function LoadSearch(DB: any) {
    setLoading(true);
    setTracks([]);

    const res = await searchTrackAPI(searchContent);
    const data = res.data;

    const updatedData = data.map((item: any) => {
      const artistList =
        item.artists?.length > 0
          ? item.artists.map((a: any) => a.name)
          : item.user?.name
            ? [item.user.name]
            : [];

      const artworkUrl =
        item.artwork?.["1000x1000"] ||
        item.artwork?.["480x480"] ||
        item.artwork?.["150x150"] ||
        "https://cdn-icons-png.flaticon.com/512/727/727245.png";

      return {
        id: item.id,
        track_id: item.track_id,
        title: item.title,
        artists: artistList,
        is_inPlayList: DB.songs.includes(item.track_id),
        access: {
          download: item.access?.download ?? true,
          stream: item.access?.stream ?? true,
        },
        image: artworkUrl,
      };
    });

    setTracks(updatedData);
    setLoading(false);
  }

  async function loadDB() {
    try {
      const data = await playlistBUS.getPlaylistByIdPL(uid, plid);
      setDBPlaylist(data);
      await LoadSearch(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadDB();
  }, []);

  useEffect(() => {
    if (!DBPlaylist) return;
    LoadSearch(DBPlaylist);
  }, [searchContent]);

  return (
    <View>
      {loading && (
        <Text className="text-gray-400 text-center">Đang tải bài hát...</Text>
      )}
      <FlatList
        scrollEnabled={false}
        data={tracks}
        keyExtractor={(item, index) => item.id}
        contentContainerStyle={{
          gap: 10,
          paddingHorizontal: 20,
          paddingVertical: 0,
        }}
        renderItem={({ item, index }) => (
          <View className="flex flex-row items-center">
            <Image
              source={{
                uri: item.image,
              }}
              style={{ width: 70, height: 70, borderRadius: 10 }}
            />
            <View className="flex-1 mx-3">
              <Text className="font-semibold text-base text-white">
                {item.title}
              </Text>
              <Text className="text-sm text-gray-500">
                {item.artists && item.artists.length > 0
                  ? item.artists.join(", ")
                  : "Unknown Artist"}
              </Text>
            </View>
            <View className="flex flex-row items-center gap-1">
              {!item.is_inPlayList && (
                <Pressable
                  onPress={() => {
                    DeviceEventEmitter.emit("statusSearchMusicList", "success");
                    setTracks((prevTracks) => {
                      if (!prevTracks) return prevTracks;
                      const newTracks = [...prevTracks];
                      newTracks[index] = {
                        ...newTracks[index],
                        is_inPlayList: true,
                      };
                      return newTracks;
                    });
                    playlistBUS.addSongInPlaylist(uid, plid, item.track_id);
                  }}
                >
                  <CirclePlus width={22} strokeWidth={1.5} color={'#fff'}/>
                </Pressable>
              )}
              {item.is_inPlayList && (
                <Pressable
                  onPress={() => {
                    DeviceEventEmitter.emit("statusSearchMusicList", "success");
                    setTracks((prevTracks) => {
                      if (!prevTracks) return prevTracks;
                      const newTracks = [...prevTracks];
                      newTracks[index] = {
                        ...newTracks[index],
                        is_inPlayList: false,
                      };
                      return newTracks;
                    });
                    playlistBUS.deleteSongInPlaylist(uid, plid, item.track_id)
                  }}
                >
                  <CheckCheck width={22} strokeWidth={1.5} color={"#fff"}/>
                </Pressable>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}
