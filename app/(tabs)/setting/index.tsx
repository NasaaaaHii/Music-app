import { Redirect } from "expo-router";
import {
  Bell,
  BellRing,
  Info,
  Moon,
  Music,
  Trash,
  User,
} from "lucide-react-native";
import {
  Dialog,
  Portal,
  Provider,
  Text,
  TextInput,
} from "react-native-paper";

import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import userBUS from "../../../backend/BUS/userBUS";
import {
  FIREBASE_AUTH,
  getError,
  onAuthStateChanged,
  signOut,
} from "../../../config/firebaseConfig";
import { t } from "../../theme";
type Mode = "Light" | "Dark";
export default function Setting() {
  const [isDarkMode, setIsDarkMode] = useState<Mode>("Dark");
  const [isNotification, setIsNotification] = useState(false);
  const [valid, setValid] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");

  async function signOutFunction() {
    try {
      await signOut(FIREBASE_AUTH);
      setValid(null);
    } catch (e) {
      console.log(e);
    }
  }

  async function showDialog() {
    setPassword("");
    setVisible(true);
  }

  async function deleteFunction() {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) return;

      const credential = EmailAuthProvider.credential(user.email!, password);
      await reauthenticateWithCredential(user, credential);
      await userBUS.deleteUser(user.uid);
      await deleteUser(user);
      Alert.alert("Thành công", "Tài khoản đã bị xóa.");
      setValid(null);
    } catch (e: any) {
      setVisible(false);
      if(e.code==="auth/invalid-credential") alert("Mật khẩu không hợp lệ")
      else alert(getError(e.code));
    }
  }

  async function init() {
    try {
      setLoadingPage(true);
      const f = await onAuthStateChanged(FIREBASE_AUTH, async (user) => {
        if (user && user.emailVerified) {
          setValid(user);
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
  }, []);

  if (loadingPage)
    return (
      <View className="flex-1 bg-purple-900 justify-center items-center">
        <ActivityIndicator size={"large"} color="white" />
      </View>
    );
  if (!valid) return <Redirect href="/" />;

  return (
    <Provider>
      <Portal>
        <Dialog visible={visible}>
          <Dialog.Title>Xác nhận xóa tài khoản</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">Nhập lại mật khẩu để xác nhận:</Text>
            <TextInput
              label="Mật khẩu"
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              title="Hủy"
              onPress={() => {
                setVisible(false);
              }}
            />
            <Button
              title="Xác nhận"
              onPress={() => {
                deleteFunction();
              }}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
              <TouchableOpacity
                className="px-4 py-2 rounded-lg bg-red-500"
                onPress={() => {
                  signOutFunction();
                }}
              >
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
              <Pressable
                onPress={() => {
                  showDialog();
                }}
              >
                <View className="flex flex-row justify-center items-center gap-4 rounded-2xl p-3 bg-red-700">
                  <Trash size={24} color={t.text} strokeWidth={2.5} />
                  <Text className="text-xl font-bold" style={{ color: t.text }}>
                    Xóa tài khoản
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </Provider>
  );
}
