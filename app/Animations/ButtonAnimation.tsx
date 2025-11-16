import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { t } from "../theme";

interface ButtonAnimationProps {
  item: string;
  onPress: () => void;
  isActive?: boolean;
}

const ButtonAnimation: React.FC<ButtonAnimationProps> = ({ item, onPress, isActive = false }) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const shadowOpacity = useSharedValue(isActive ? 0.3 : 0.1);
  const elevation = useSharedValue(isActive ? 4 : 2);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
      shadowOpacity: shadowOpacity.value,
      elevation: elevation.value,
      shadowRadius: interpolate(
        scale.value,
        [0.85, 1],
        [2, 8],
        Extrapolate.CLAMP
      ),
    };
  });

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      shadowColor: isActive ? t.primary : "#000",
      shadowOffset: {
        width: 0,
        height: interpolate(scale.value, [0.85, 1], [1, 4], Extrapolate.CLAMP),
      },
    };
  });

  const handlePressIn = () => {
    scale.value = withSequence(
      withTiming(0.9, { duration: 50 }),
      withSpring(0.85, {
        damping: 10,
        stiffness: 100,
      })
    );

    rotation.value = withSpring(-3, { damping: 10 });

    shadowOpacity.value = withTiming(0.05, { duration: 100 });
    elevation.value = withTiming(1, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.05, {
        damping: 5,
        stiffness: 200,
      }),
      withSpring(1, {
        damping: 8,
        stiffness: 150,
      })
    );

    rotation.value = withSpring(0, { damping: 10 });

    shadowOpacity.value = withTiming(0.15, { duration: 200 });
    elevation.value = withTiming(4, { duration: 200 });
  };

  return (
    <Animated.View style={[containerAnimatedStyle]}>
      <Animated.View style={[animatedStyle, styles.button]}>
        {isActive ? (
          <LinearGradient
            colors={t.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 9999,
              shadowColor: t.primary,
              shadowOpacity: 0.5,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <TouchableOpacity
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={onPress}
              className="rounded-full px-5 py-3"
              activeOpacity={1}
            >
              <Text className="text-sm font-semibold" style={{ color: t.surface }}>{item}</Text>
            </TouchableOpacity>
          </LinearGradient>
        ) : (
          <TouchableOpacity
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            className="rounded-full px-5 py-3"
            style={{
              backgroundColor: t.cardBg,
              borderWidth: 1.5,
              borderColor: t.tabBarBorder,
            }}
            activeOpacity={1}
          >
            <Text className="text-sm font-semibold" style={{ color: t.text }}>{item}</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default ButtonAnimation;
