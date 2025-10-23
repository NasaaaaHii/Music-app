import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CreatePlayList(){
    const [colorBorder, setColorBorder] = useState("border-[#afafaf]")
    const [activeButton, setActiveButton] = useState(false)
    const [colorButton, setColorButton] = useState("bg-[#eaeaea] text-[#959595]")

    useEffect(()=>{
        setColorButton(
            (activeButton?"bg-blue-500 text-white":"bg-[#eaeaea] text-[#959595]")
        )

    }, [activeButton])

    return <SafeAreaView className="flex bg-white">
            <View className="w-full h-full flex flex-col">
                <View className="w-full">
                    <Pressable onPress={() => router.back()} className="w-fit self-start">
                        <Ionicons
                        name="close-outline"
                        size={30}
                        color="#1c1c1c"
                        className="p-4"
                        />
                    </Pressable>
                    <View className="p-5">
                        <Text className="text-gray-500 text-sm">Tên danh sách phát</Text>
                        <TextInput placeholder="Nhập tên danh sách phát" className={`text-lg border-b-2 ${colorBorder}`} 
                            onFocus={() => {setColorBorder("border-blue-500")}}
                            onBlur={() => {setColorBorder("border-[#afafaf]")}}
                            onChangeText={(item) => {setActiveButton(item.length > 0)}}
                        />
                    </View>
                </View>
                <View className="p-5">
                    <Pressable onPress={()=>{
                        if(activeButton) router.back()
                    }}>
                        <Text className={`${colorButton} w-full text-center p-3 text-lg font-semibold rounded-3xl`}>Tạo danh sách phát</Text>
                    </Pressable>
                </View>
            </View>
    </SafeAreaView>
}