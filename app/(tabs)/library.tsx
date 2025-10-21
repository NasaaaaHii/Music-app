import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function library(){
    return (
        <SafeAreaView className='flex justify-center items-center bg-red-200 w-full h-full'>
            <Text>library</Text>
        </SafeAreaView>
    );
}