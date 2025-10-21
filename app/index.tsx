import React, { useRef } from 'react';
import { StyleSheet, View, Button, ViewProps } from 'react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

// ✅ forwardRef đặt tên function để tránh lỗi display-name
const MyView = React.forwardRef<View, ViewProps>(function MyView(props, ref) {
    return <View ref={ref} {...props} />;
});

const MyAnimatedView = Animated.createAnimatedComponent(MyView);

export default function App() {
    const ref = useRef<View | null>(null);
    const width = useSharedValue(100);

    const handlePress = () => {
        width.value = withSpring(width.value + 50);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        width: width.value,
    }));

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        box: {
            height: 100,
            backgroundColor: '#b58df1',
            borderRadius: 20,
            marginVertical: 64,
        },
    });

    return (
        <View style={styles.container} className={'bg-red-200'}>
            <MyAnimatedView ref={ref} style={[styles.box, animatedStyle]} />
            <Button onPress={handlePress} title="Click me"/>
        </View>
    );
}
