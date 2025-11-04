import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FIREBASE_AUTH, getError, onAuthStateChanged, signOut } from "../../../config/firebaseConfig";

export default function Account() {
  const [valid, setValid] = useState(false)
  const [loading, setLoading] = useState(true)

  async function init() {
    try{
      setLoading(true)
      const f = await onAuthStateChanged(FIREBASE_AUTH, (user) => {
        if (user && user.emailVerified){
          setValid(true)
        }
        setLoading(false)
      });
      return f
    }
    catch(e: any){
      alert(getError(e.code))
    }
  }

  useEffect(() => {
    init()
  }, []);

  async function logOut() {
    try{
      await signOut(FIREBASE_AUTH)
      router.replace("/")
    }
    catch(e: any){
      alert(getError(e.code))
    }
  }

  if(loading) return <View className="flex-1 bg-purple-900 justify-center items-center"><ActivityIndicator size={"large"} color="white" /></View>
  if(!valid) return <Redirect href="/" />;
  return (
    <SafeAreaView>
      <View>
        <Text>Account</Text>
      </View>
      <Pressable onPress={() => { logOut() }} className="bg-red-200 w-fit p-3">
        <Text>Đăng xuất</Text>
      </Pressable>
    </SafeAreaView>
  );
}
