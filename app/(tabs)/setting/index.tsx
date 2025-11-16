import { LinearGradient } from "expo-linear-gradient";
import { Redirect } from "expo-router";
import {
  Bell,
  BellRing,
  Info,
  Moon,
  Music,
  Trash,
  UserRound,
} from "lucide-react-native";
import { Dialog, Portal, Provider, Text, TextInput } from "react-native-paper";

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
  Switch,
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
  const [isNotification, setIsNotification] = useState(true);
  const [valid, setValid] = useState<any>(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });

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
      if (e.code === "auth/invalid-credential") alert("Mật khẩu không hợp lệ");
      else alert(getError(e.code));
    }
  }

  async function init() {
    try {
      setLoadingPage(true);
      const f = await onAuthStateChanged(FIREBASE_AUTH, async (user) => {
        if (user && user.emailVerified) {
          setValid(user);
          setUserInfo({
            name: user.displayName || user.email?.split("@")[0] || "Người dùng",
            email: user.email || "",
          });
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
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: t.surface }}
        contentContainerStyle={{ padding: 32, paddingBottom: 160 }}
      >
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.02)",
            borderRadius: 24,
            padding: 32,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.05)",
          }}
        >
          <View className="flex-row items-center gap-4">
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
              }}
            >
              <Music color={t.primary} size={36} strokeWidth={2.5} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: t.text, fontSize: 24, fontWeight: "700" }}>
                Xin chào, {userInfo.name}
              </Text>
              <Text style={{ color: t.textMuted }}>{userInfo.email}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={signOutFunction}
            style={{
              marginTop: 16,
              paddingVertical: 12,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.1)",
              alignItems: "center",
            }}
          >
            <Text style={{ color: t.text, fontWeight: "600" }}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 gap-4">
          <Text
            style={{
              color: t.text,
              fontSize: 18,
              fontWeight: "700",
              letterSpacing: 0.3,
            }}
          >
            Cá nhân hóa
          </Text>

          <View
            style={{
              backgroundColor: t.cardBg,
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: t.cardHover }}
                >
                  <Moon color={t.primary} size={20} strokeWidth={2.5} />
                </View>
                <View>
                  <Text
                    style={{
                      color: t.text,
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    Chế độ giao diện
                  </Text>
                  <Text style={{ color: t.textMuted }}>
                    {isDarkMode === "Dark"
                      ? "Đang sử dụng Dark mode"
                      : "Đang sử dụng Light mode"}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-2">
                <Text style={{ color: t.textMuted, fontSize: 12 }}>Light</Text>
                <Switch
                  value={isDarkMode === "Dark"}
                  onValueChange={() =>
                    setIsDarkMode((prev) =>
                      prev === "Dark" ? "Light" : "Dark"
                    )
                  }
                  trackColor={{ false: "#9CA3AF", true: t.primary }}
                  thumbColor={t.surface}
                />
                <Text style={{ color: t.textMuted, fontSize: 12 }}>Dark</Text>
              </View>
            </View>
          </View>

          <View
            style={{
              backgroundColor: t.cardBg,
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3 flex-1">
                <View
                  className="p-3 rounded-2xl"
                  style={{ backgroundColor: t.cardHover }}
                >
                  {isNotification ? (
                    <BellRing color={t.primary} size={20} strokeWidth={2.5} />
                  ) : (
                    <Bell color={t.primary} size={20} strokeWidth={2.5} />
                  )}
                </View>
                <View>
                  <Text
                    style={{
                      color: t.text,
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    Thông báo mới
                  </Text>
                  <Text style={{ color: t.textMuted }}>
                    Nhận thông báo khi có playlist hot
                  </Text>
                </View>
              </View>
              <Switch
                value={isNotification}
                onValueChange={setIsNotification}
                trackColor={{ false: "#9CA3AF", true: t.primary }}
                thumbColor={t.surface}
              />
            </View>
          </View>
        </View>

        <View className="mt-8 gap-4">
          <Text
            style={{
              color: t.text,
              fontSize: 18,
              fontWeight: "700",
              letterSpacing: 0.3,
            }}
          >
            Thông tin ứng dụng
          </Text>
          <View
            style={{
              backgroundColor: t.cardBg,
              borderRadius: 20,
              padding: 16,
              gap: 16,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
            }}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="p-3 rounded-2xl"
                style={{ backgroundColor: t.cardHover }}
              >
                <Info color={t.primary} size={20} strokeWidth={2.5} />
              </View>
              <View>
                <Text
                  style={{
                    color: t.text,
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  Phiên bản
                </Text>
                <Text style={{ color: t.textMuted }}>Music App v1.0.0</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3">
              <View
                className="p-3 rounded-2xl"
                style={{ backgroundColor: t.cardHover }}
              >
                <UserRound color={t.primary} size={20} strokeWidth={2.5} />
              </View>
              <View>
                <Text
                  style={{
                    color: t.text,
                    fontWeight: "600",
                    fontSize: 16,
                  }}
                >
                  Cập nhật cuối
                </Text>
                <Text style={{ color: t.textMuted }}>15/11/2025</Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable onPress={showDialog} className="mt-10">
          <LinearGradient
            colors={["#F43F5E", "#BE123C"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 20,
              paddingVertical: 18,
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              gap: 10,
            }}
          >
            <Trash size={20} color="#fff" strokeWidth={2.5} />
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: 16,
                letterSpacing: 0.5,
              }}
            >
              Xóa tài khoản
            </Text>
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </Provider>
  );
}
