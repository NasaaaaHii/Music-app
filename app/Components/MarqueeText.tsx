import { useEffect, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  Text,
  TextProps,
  View,
} from "react-native";

interface MarqueeTextProps extends TextProps {
  children: string;
  duration?: number;
  delay?: number;
  speed?: number;
}

export default function MarqueeText({
  children,
  style,
  duration = 10000,
  delay = 1000,
  speed = 50,
  ...textProps
}: MarqueeTextProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    let loopAnimation: Animated.CompositeAnimation | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (shouldAnimate && textWidth > containerWidth && containerWidth > 0) {
      const scrollDistance = textWidth - containerWidth + 60;
      const scrollDuration = Math.max(1000, (scrollDistance / speed) * 1000);

      animatedValue.setValue(0);

      timeoutId = setTimeout(() => {
        loopAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: -scrollDistance,
              duration: scrollDuration,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.delay(delay),
          ]),
          { iterations: -1 }
        );

        loopAnimation.start();
      }, delay);
    } else {
      animatedValue.stopAnimation();
      animatedValue.setValue(0);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (loopAnimation) {
        loopAnimation.stop();
      }
      animatedValue.stopAnimation();
      animatedValue.setValue(0);
    };
  }, [shouldAnimate, textWidth, containerWidth, speed, delay, animatedValue]);

  const handleTextLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setTextWidth(width);
    setShouldAnimate(width > containerWidth && containerWidth > 0);
  };

  const handleContainerLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setContainerWidth(width);
    setShouldAnimate(textWidth > width && width > 0);
  };

  return (
    <View
      style={[
        {
          overflow: "hidden",
          flexShrink: 1,
          minWidth: 0,
        },
      ]}
      onLayout={handleContainerLayout}
    >
      <Animated.View
        style={{
          transform: [{ translateX: animatedValue }],
          flexDirection: "row",
        }}
        pointerEvents="none"
      >
        <Text
          {...textProps}
          style={[style]}
          onLayout={handleTextLayout}
          numberOfLines={1}
          ellipsizeMode="clip"
        >
          {children}
        </Text>
        {shouldAnimate && (
          <Text
            {...textProps}
            style={[style, { marginLeft: 60 }]}
            numberOfLines={1}
            ellipsizeMode="clip"
          >
            {children}
          </Text>
        )}
      </Animated.View>
    </View>
  );
}
