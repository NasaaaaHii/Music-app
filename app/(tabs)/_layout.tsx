import { Tabs } from 'expo-router';

export default function _layout(){
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{ headerShown:false, title:'Home' }} />
            <Tabs.Screen name="search" options={{ headerShown:false, title:'Search' }} />
            <Tabs.Screen name="library" options={{ headerShown:false, title:'Library' }} />
        </Tabs>
    );
}