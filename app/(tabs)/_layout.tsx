import { Tabs } from 'expo-router';

export default function _layout(){
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ headerShown:false, title:'Home' }} />
            <Tabs.Screen name="player" options={{ headerShown:false, title:'Player' }} />
            <Tabs.Screen name="favorites" options={{ headerShown:false, title:'Favorites' }} />
            <Tabs.Screen name="settings" options={{ headerShown:false, title:'Settings' }} />
        </Tabs>
    );
}