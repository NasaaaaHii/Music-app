import { router } from "expo-router";
import {
  ChevronDown,
  CirclePlus,
  Ellipsis,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Timer,
  X,
} from "lucide-react-native";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import MusicCard from "./Components/MusicCard";
const player = () => {
  const artistData = {
    id: "1",
    title: "Noo Phước Thịnh",
    image: require("../assets/images/nhac_1.png"),
    follow: "2.5M",
  };
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-4 pb-8 pt-8">
        <View className="flex flex-row justify-between gap-4 items-center">
          <TouchableOpacity
            className="rounded-full"
            onPress={() => router.back()}
          >
            <ChevronDown />
          </TouchableOpacity>
          <View className="flex flex-col gap-1 items-center">
            <Text className="text-black font-normal text-md">
              Đang phát từ danh sách phát
            </Text>
            <Text className="font-bold text-base">Khó quá thì về mẹ nuôi</Text>
          </View>
          <TouchableOpacity className="rounded-full">
            <Ellipsis style={{ transform: [{ rotate: "90deg" }] }} size={24} />
          </TouchableOpacity>
        </View>
        <View className="mt-16 flex items-center px-2">
          <Image
            className="h-96 w-full rounded-lg"
            source={require("../assets/images/nhac_1.png")}
          />
        </View>
        <View className="mt-16 flex flex-row justify-between gap-2 px-2">
          <View className="">
            <Text className="font-bold text-2xl">Khó quá thì về mẹ nuôi</Text>
            <Text className="text-xl text-gray-700">Noo Phước Thịnh</Text>
          </View>
          <View className="flex flex-row gap-1">
            <TouchableOpacity className="p-3 rounded-full">
              <X color="#1f2937" size={30} strokeWidth={2.5} />
            </TouchableOpacity>
            <TouchableOpacity className="p-3 rounded-full">
              <CirclePlus color="#1f2937" size={30} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </View>
        <View className="px-2 mt-8 flex flex-col">
          <View className="h-1 w-full bg-gray-200 flex items-start relative">
            <View className="bg-green-500 w-2 h-2 rounded-full absolute -top-0.5"></View>
          </View>
          <View className="flex flex-row justify-between pt-2">
            <Text className="text-md text-gray-700">0:00</Text>
            <Text className="text-md text-gray-700">2:30</Text>
          </View>
        </View>
        <View className="flex flex-row justify-between gap-3 mt-10 items-center">
          <TouchableOpacity>
            <Repeat size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity>
            <SkipBack size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity className="p-5 rounded-full bg-black">
            <Play color="white" fill="white" size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity>
            <SkipForward size={24} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Timer size={24} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        <View className="mt-10">
          <MusicCard
            item={artistData}
            variant="artistsBoard"
            width="w-full"
            imageHeight="h-48"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default player;
