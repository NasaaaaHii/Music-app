import {
  Bell,
  BellRing,
  Info,
  Moon,
  Music,
  Trash,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { t } from "../../theme";
type Mode = "Light" | "Dark";
export default function Setting() {
  const [isDarkMode, setIsDarkMode] = useState<Mode>("Dark");
  const [isNotification, setIsNotification] = useState(false);
  return (
    <ScrollView className="flex-1" style={{ backgroundColor: t.tabBarBg }}>
      <View className="px-5 pt-16 pb-6 mb-24">
        <View className="flex flex-col justify-center gap-4 items-center">
          <View
            className="rounded-full shadow-lg p-10 "
            style={{ backgroundColor: t.primaryDark }}
          >
            <Music color={t.text} size={48} strokeWidth={2.5} />
          </View>
          <Text className="text-4xl font-bold pt-4" style={{ color: t.text }}>
            Cài đặt
          </Text>
        </View>
        <View className="flex flex-col gap-4 pt-8">
          <Text className="text-xl font-bold" style={{ color: t.text }}>
            Tài khoản
          </Text>
          <View
            className="flex flex-row justify-between items-center gap-4 rounded-2xl p-3"
            style={{ backgroundColor: t.primary }}
          >
            <View className="flex flex-row gap-4">
              <View
                className="p-4 rounded-full"
                style={{ backgroundColor: t.surface }}
              >
                <User size={22} color={t.primary} strokeWidth={2.5} />
              </View>
              <View className="flex flex-col gap-1">
                <Text
                  className="text-lg font-bold"
                  style={{ color: t.surface }}
                >
                  Tên User
                </Text>
                <Text
                  className="text-md font-normal"
                  style={{ color: t.surface }}
                >
                  Tên tài khoản
                </Text>
              </View>
            </View>
            <TouchableOpacity className="px-4 py-2 rounded-lg bg-red-500">
              <Text className="text-md font-bold" style={{ color: t.text }}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex flex-col gap-4 pt-8">
          <Text className="text-xl font-bold" style={{ color: t.text }}>
            Màu giao diện
          </Text>
          <View
            className="flex flex-row justify-between items-center gap-4 rounded-2xl p-3"
            style={{ backgroundColor: t.primary }}
          >
            <View className="flex flex-row gap-4">
              <View
                className="p-4 rounded-full"
                style={{ backgroundColor: t.surface }}
              >
                <Moon size={22} color={t.primary} strokeWidth={2.5} />
              </View>
              <View className="flex flex-col gap-1">
                <Text
                  className="text-lg font-bold"
                  style={{ color: t.surface }}
                >
                  {isDarkMode === "Dark" ? "Dark Mode" : "Light Mode"}
                </Text>
                <Text
                  className="text-md font-normal"
                  style={{ color: t.surface }}
                >
                  Chuyển chế độ sáng tối
                </Text>
              </View>
              <TouchableOpacity></TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="flex flex-col pt-8">
          <Text className="text-xl font-bold" style={{ color: t.text }}>
            Thông tin
          </Text>
          <View
            className="flex flex-row justify-between items-center gap-4 rounded-t-2xl p-3"
            style={{ backgroundColor: t.primary }}
          >
            <View className="flex flex-row gap-4">
              <View
                className="p-4 rounded-full"
                style={{ backgroundColor: t.surface }}
              >
                {isNotification ? (
                  <BellRing size={22} color={t.primary} strokeWidth={2.5} />
                ) : (
                  <Bell size={22} color={t.primary} strokeWidth={2.5} />
                )}
              </View>
              <View className="flex flex-col gap-1">
                <Text
                  className="text-lg font-bold"
                  style={{ color: t.surface }}
                >
                  Thông báo
                </Text>
                <Text
                  className="text-md font-normal"
                  style={{ color: t.surface }}
                >
                  Thông báo khi có nhạc mới
                </Text>
              </View>
              <TouchableOpacity></TouchableOpacity>
            </View>
          </View>
          <View
            className="flex flex-row justify-between items-center gap-4 rounded-b-2xl p-3"
            style={{ backgroundColor: t.primary }}
          >
            <View className="flex flex-row gap-4">
              <View
                className="p-4 rounded-full"
                style={{ backgroundColor: t.surface }}
              >
                <Info size={22} color={t.primary} strokeWidth={2.5} />
              </View>
              <View className="flex flex-col gap-1">
                <Text
                  className="text-lg font-bold"
                  style={{ color: t.surface }}
                >
                  Phiên bản
                </Text>
                <Text
                  className="text-md font-normal"
                  style={{ color: t.surface }}
                >
                  Music App v1.0.0
                </Text>
              </View>
              <TouchableOpacity></TouchableOpacity>
            </View>
          </View>
          <View className="flex flex-col gap-4 pt-8">
            <View
              className="flex flex-row justify-center items-center gap-4 rounded-2xl p-3 bg-red-700"
              // style={{ backgroundColor: t.primary }}
            >
              <Trash size={24} color={t.text} strokeWidth={2.5} />
              <Text className="text-xl font-bold" style={{ color: t.text }}>
                Xóa tài khoản
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
