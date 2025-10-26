import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ImageProps, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlayLists() {
  const params = useLocalSearchParams();

  const [iconHeader, setIconHeader] = useState<React.ReactNode>(null);

  useEffect(() => {
    if (params.type === "category") {
      setIconHeader(
        <View className="flex flex-row justify-center items-center bg-[#f0eff4] rounded-xl">
          <Feather
            name={params.icon as keyof typeof Feather.glyphMap}
            size={100}
            color={"#d0cfd5"}
              className="aspect-square p-28"
          />
        </View>
      );
    }
    else if(params.type === "playlists"){
      if(params.firstMusic == null){
        setIconHeader(
          <View className="flex flex-row justify-center items-center bg-[#f0eff4] rounded-xl">
            <Feather
              name="music"
              size={100}
              color={"#d0cfd5"}
              className="aspect-square p-28"
            />
          </View>
        )
      }
      else{
        setIconHeader(
          <View className="flex px-20 flex-row justify-center items-center">
            <Image
              source={ params.firstMusic as ImageProps}
              className="aspect-square w-full rounded-xl"
            />
          </View>
        )
      }
    }
  }, []);

  return (
    <SafeAreaView className="flex bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-col justify-center items-center gap-5 w-full">
          <View className="w-full">
            <View className="flex flex-row justify-between gap-6">
              <Pressable onPress={() => router.back()} className="w-fit">
                <Feather
                  name="arrow-left"
                  size={24}
                  color="#1c1c1c"
                  className="p-4"
                />
              </Pressable>
              <View className="flex flex-row justify-center items-center h-full">
                <Text className="text-xl font-semibold">Danh sách phát</Text>
              </View>
              <Pressable onPress={() => router.back()} className="w-fit">
                <Feather
                  name="more-vertical"
                  size={24}
                  color="#1c1c1c"
                  className="p-4"
                />
              </Pressable>
            </View>
          </View>
          {iconHeader}
          <View>
            <Text className="font-semibold text-xl text-center">
              {params.title}
            </Text>
            <Text className="text-gray-500 text-base text-center">
              {params.count} bài hát
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
