import {
    BellRing,
    Mic,
    MoreVertical,
    Search,
    Settings,
} from "lucide-react-native";
import React from "react";
import {
    Image, ScrollView, Text, TextInput, TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function SearchMusic() {
    const topSearch = [
        {
            id: "1",
            title: "nhac 1",
            artist: "tac gia 1",
            image: require("../../../assets/images/nhac_1.png"),
        },
        {
            id: "2",
            title: "nhac 2",
            artist: "tac gia 2",
            image: require("../../../assets/images/nhac_2.png"),
        },
        {
            id: "3",
            title: "nhac 3",
            artist: "tac gia 3",
            image: require("../../../assets/images/nhac_3.png"),
        },
        {
            id: "4",
            title: "nhac 4",
            artist: "tac gia 4",
            image: require("../../../assets/images/nhac_1.png"),
        },
        {
            id: "5",
            title: "nhac 5",
            artist: "tac gia 5",
            image: require("../../../assets/images/nhac_3.png"),
        },
        {
            id: "6",
            title: "nhac 6",
            artist: "tac gia 6",
            image: require("../../../assets/images/nhac_2.png"),
        },
    ];

    const hotTrending = [
        require("../../../assets/images/nhac_1.png"),
        require("../../../assets/images/nhac_2.png"),
        require("../../../assets/images/nhac_3.png"),
    ];

    const filterButton = ["New Music", "Top", "Trending", "Podcast", "Free"];
    return (
        <SafeAreaView className="flex-1 px-4 w-full h-full bg-black">
            {/* Header */}
            <View className="flex flex-row justify-between p-2">
                <Text className="text-white font-semibold text-[25px]">Search</Text>
                <View className="flex flex-row gap-6">
                    <BellRing color={"white"} size={20} />
                    <Settings color={"white"} size={20} />
                </View>
            </View>
            <View className="flex flex-row items-center mt-3">
                <Search color="white" size={22} />
                <TextInput
                    placeholder="Search Music"
                    placeholderTextColor={"#888"}
                    className="flex-1 bg-neutral-900 text-white px-3 py-3 mx-2 rounded-full"
                />
                <Mic color={"yellow"} size={22} />
            </View>

            {/* Button filter */}
            <View className="flex flex-row justify-between mt-4">
                {filterButton.map((item, index) => (
                    <TouchableOpacity key={index}>
                        <Text
                            className={`text-sm ${item === "New Music"
                                    ? "text-black bg-yellow-400"
                                    : "text-white bg-neutral-800"
                                } px-3 py-1 rounded-full`}
                        >
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Content: list music search */}
            <ScrollView className="mt-6" showsVerticalScrollIndicator={false}>
                {/* top song search */}
                <View className="flex flex-row justify-between items-center mb-3">
                    <Text className="text-white font-semibold">Top Search Song</Text>
                    <Text className="text-yellow-400 text-sm underline">Sell all</Text>
                </View>
                {topSearch.map((song) => (
                    <View key={song.id} className="flex-row items-center mb-3">
                        <Image source={song.image} className="w-12 h-12 rounded-sm" />
                        <View className="flex-1 ml-3">
                            <Text className="text-white font-semibold">{song.title}</Text>
                            <Text className="text-gray-400 text-sm">{song.artist}</Text>
                        </View>
                        <MoreVertical color={"white"} size={20} />
                    </View>
                ))}

                {/* Hot trending */}
                <Text className="text-white text-lg font-semibold mt-6 mb-3">
                    Hot & trending
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {hotTrending.map((item, index) => (
                        <Image
                            key={index}
                            source={item}
                            className="w-32 h-32 rounded-xl mr-3"
                        />
                    ))}
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    );
}
