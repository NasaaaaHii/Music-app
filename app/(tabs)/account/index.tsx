import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Account() {
  return (
    <SafeAreaView>
      <View>
        <Text>Account</Text>
      </View>
      <Pressable onPress={() => {}} className="bg-red-200 w-fit p-3">
        <Text>Đăng xuất</Text>
      </Pressable>
    </SafeAreaView>
  );
}
