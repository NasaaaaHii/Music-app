import { Redirect, router } from "expo-router";
import {
  ArrowDownToLine,
  Heart,
  LibraryBig,
  Music,
  Plus,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  DeviceEventEmitter,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import playlistBUS from "../../../backend/BUS/playlistBUS";
import userBUS from "../../../backend/BUS/userBUS";
import {
  FIREBASE_AUTH,
  getError,
  onAuthStateChanged,
} from "../../../config/firebaseConfig";

export default function Index() {
  const playlist = [
    {
      firstMusic: require("../../../assets/images/nhac_1.png"),
      title: "Thư viện 1",
      count: 3,
    },
    {
      firstMusic: require("../../../assets/images/nhac_2.png"),
      title: "Thư viện 2",
      count: 6,
    },
    {
      firstMusic: null,
      title: "Thư viện mới",
      count: 0,
    },
  ];
  const [valid, setValid] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [DBUser, setDBUser] = useState<any>(null);
  const [DBPlaylist, setDBPlaylist] = useState<any>(null);

  async function loadDB(uid: string) {
    try {
      const dataUser = await userBUS.getUserById(uid);
      const dataPlaylist = await playlistBUS.getPlaylist(uid);
      setDBUser(dataUser);
      setDBPlaylist(dataPlaylist);
    } catch (e) {
      const err = e as Error;
      console.log(err.message);
    }
  }

  async function init() {
    try {
      setLoadingPage(true);
      const f = await onAuthStateChanged(FIREBASE_AUTH, async (user) => {
        if (user && user.emailVerified) {
          setValid(user);
          await loadDB(user?.uid);
        }
        setLoadingPage(false);
      });
      return f;
    } catch (e: any) {
      alert(getError(e.code));
    }
  }

  useEffect(() => {
    init();
    const sub = DeviceEventEmitter.addListener("playlistStatus", (status) => {
      if (status === "success")
        (async () => {
          await loadDB(FIREBASE_AUTH.currentUser!.uid);
        })();
    });
    return () => sub.remove();
  }, []);

  if (loadingPage)
    return (
      <View className="flex-1 bg-purple-900 justify-center items-center">
        <ActivityIndicator size={"large"} color="white" />
      </View>
    );
  if (!valid) return <Redirect href="/" />;

  return (
    <SafeAreaView className="flex-1 bg-[#f4f3f8]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex justify-center items-center gap-3 w-full p-10">
          <View className="rounded-full bg-sky-500 p-10">
            <LibraryBig size={50} color={"#ffffff"} />
          </View>
          <Text className="text-3xl font-bold text-gray-900">Thư viện</Text>
          <Text className="text-gray-600">
            {DBPlaylist.length} danh sách phát
          </Text>
        </View>

        {/* Main */}
        <View className="flex flex-col items-start gap-14 pb-80">
          {/* Danh mục */}
          <View className="flex gap-5">
            <Text className="text-xl font-semibold text-gray-900 pl-6">
              Danh mục
            </Text>
            <View className="flex flex-row gap-5 pl-5">
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/library/playlists",
                    params: {
                      type: "category",
                      icon: "heart",
                      title: "Yêu thích",
                      count: 0,
                    },
                  })
                }
              >
                <View className="bg-white w-[130px] h-[130px] p-4 flex flex-col justify-between rounded-xl">
                  <Heart size={30} color={"#f9448d"} />
                  <View>
                    <Text className="text-md font-semibold text-gray-900">
                      Yêu thích
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {DBUser.liked.length} bài hát
                    </Text>
                  </View>
                </View>
              </Pressable>

              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "/library/playlists",
                    params: {
                      type: "category",
                      icon: "heart",
                      title: "Đã tải",
                      count: 1,
                    },
                  })
                }
              >
                <View className="bg-white w-[130px] h-[130px] p-4 flex flex-col justify-between rounded-xl">
                  <ArrowDownToLine size={30} color={"#28a745"} />
                  <View>
                    <Text className="text-md font-semibold text-gray-900">
                      Đã tải
                    </Text>
                    <Text className="text-sm text-gray-600">{0} bài hát</Text>
                  </View>
                </View>
              </Pressable>
            </View>
          </View>

          {/* Danh sách phát */}
          <View className="w-full flex gap-5">
            <Text className="text-xl font-semibold text-gray-900 pl-6">
              Danh sách phát
            </Text>
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/modal/create-playlist",
                  params: {
                    uid: valid.uid,
                  },
                });
              }}
            >
              <View className="bg-white flex flex-row items-center gap-5 ml-6 mr-6 rounded-lg">
                <View className="p-6 bg-[#f0eff4]">
                  <Plus size={40} color="#737373" />
                </View>
                <Text className="text-md font-semibold text-gray-900">
                  Tạo danh sách phát
                </Text>
              </View>
            </Pressable>

            <FlatList
              scrollEnabled={false}
              data={DBPlaylist}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 25,
                paddingHorizontal: 0,
                paddingVertical: 3,
              }}
              style={{ flexGrow: 0 }}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    router.push({
                      pathname: "/library/playlists",
                      params: {
                        type: "playlists",
                        firstMusic: require("../../../assets/images/nhac_1.png"),
                        title: "Thư viện 1",
                        count: 3,
                      },
                    });
                  }}
                >
                  <View className="bg-white flex flex-row items-center gap-5 ml-6 mr-6 rounded-lg">
                    {item.songs.length > 0 ? (
                      <Image
                        source={item.songs[0]}
                        style={{ width: 83, height: 83 }}
                      />
                    ) : (
                      <View className="p-6 bg-[#f0eff4]">
                        <Music size={40} color="#737373" />
                      </View>
                    )}
                    <View>
                      <Text className="text-md font-semibold text-gray-900">
                        {item.name}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {item.songs.length} bài hát
                      </Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
