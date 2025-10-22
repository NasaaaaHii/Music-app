import { Feather, Ionicons } from "@expo/vector-icons";
import { FlatList, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function library() {
  const category = [
    { icon: "heart", color: "#f9448d", title: "Yêu thích", count: 92 },
    { icon: "star", color: "#facc15", title: "Nổi bật", count: 50 },
    { icon: "arrow-down-circle", color: "#3b82f6", title: "Đã lưu", count: 30 },
  ];

  return (
    <SafeAreaView className="flex bg-[#f4f3f8]">
      <ScrollView
        contentContainerClassName="w-full h-full"
        showsVerticalScrollIndicator={false}
      >
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
          <Text className="text-gray-600">3 danh sách phát</Text>
        </View>
        {/* Main */}
        <View className="flex flex-col items-start gap-10">
            {/* Danh mục */}
            <View>
                <Text className="text-xl font-semibold text-gray-900 mb-3 pl-6">Danh mục</Text>
                <FlatList
                    horizontal
                    data={category}
                    keyExtractor={(item, index) => index.toString()}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 25, paddingHorizontal: 20, paddingVertical: 5}}
                    style={{flexGrow: 0}}
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
            <View>
                <Text className="text-xl font-semibold text-gray-900 mb-3 pl-6">Danh sách phát</Text>
            </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
}
