import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function library() {
  return (
    <SafeAreaView className="flex">
      <ScrollView
        contentContainerClassName="w-full h-full  bg-[#f4f3f8]"
        showsVerticalScrollIndicator={false}
      >
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
      </ScrollView>
    </SafeAreaView>
  );
}
