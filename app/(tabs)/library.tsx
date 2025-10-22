import { Feather, Ionicons } from "@expo/vector-icons";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function library() {
  const category = [
    { icon: "heart", color: "#f9448d", title: "Yêu thích", count: 92 },
    { icon: "star", color: "#facc15", title: "Nổi bật", count: 50 },
    { icon: "arrow-down-circle", color: "#3b82f6", title: "Đã lưu", count: 30 },
  ];

  const playlist = [
    {
      firstMusic: require("../../assets/images/nhac_1.png"),
      title: "Thư viện 1",
      count: 3,
    },
    {
      firstMusic: require("../../assets/images/nhac_2.png"),
      title: "Thư viện 2",
      count: 6,
    },
    {
      firstMusic: null,
      title: "Thư viện mới",
      count: 0,
    },
  ];

  return (
    <SafeAreaView className="flex bg-[#f4f3f8]">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex flex-col justify-center items-center gap-3 w-full p-10">
          <Ionicons
            name="library-outline"
            size={50}
            color={"#fff"}
            borderRadius={100}
            className="bg-sky-500 p-10"
          />
          <Text className="text-3xl font-bold text-gray-900">Thư viện</Text>
          <Text className="text-gray-600">
            {playlist.length} danh sách phát
          </Text>
        </View>
        {/* Main */}
        <View className="flex flex-col items-start gap-14 pb-80">
          {/* Danh mục */}
          <View className="flex gap-5">
            <Text className="text-xl font-semibold text-gray-900 pl-6">
              Danh mục
            </Text>
            <FlatList
              horizontal
              data={category}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 25,
                paddingHorizontal: 20,
                paddingVertical: 0,
              }}
              style={{ flexGrow: 0 }}
              renderItem={({ item }) => (
                <View className="bg-white w-[130px] h-[130px] p-4 flex flex-col justify-between rounded-xl">
                  <Feather
                    name={item.icon as keyof typeof Feather.glyphMap}
                    size={30}
                    color={item.color}
                  />
                  <View>
                    <Text className="text-md font-semibold text-gray-900">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {item.count} bài hát
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>

          {/* Danh sách phát */}
          <View className="w-full flex gap-5">
            <Text className="text-xl font-semibold text-gray-900 pl-6">
              Danh sách phát
            </Text>
            <View className="bg-white flex flex-row items-center gap-5 ml-6 mr-6 rounded-lg">
              <Feather
                name="plus"
                size={30}
                color="#737373"
                className="p-7 bg-[#f0eff4]"
              />
              <Text className="text-md font-semibold text-gray-900">
                Tạo danh sách phát
              </Text>
            </View>

            <FlatList
              scrollEnabled={false}
              data={playlist}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 25,
                paddingHorizontal: 0,
                paddingVertical: 3,
              }}
              style={{ flexGrow: 0 }}
              renderItem={({ item }) => (
                <View className="bg-white flex flex-row items-center gap-5 ml-6 mr-6 rounded-lg">
                  {item.firstMusic ? (
                    <Image
                      source={item.firstMusic}
                      className="w-[80px] h-[80px]"
                      resizeMode="cover"
                    />
                  ) : (

                    <Feather
                      name="music"
                      size={30}
                      color="#737373"
                      className="p-7 bg-[#f0eff4]"
                    />
                  )}

                  <View>
                    <Text className="text-md font-semibold text-gray-900">
                      {item.title}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {item.count} bài hát
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
