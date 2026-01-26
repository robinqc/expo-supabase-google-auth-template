import { useTheme } from "@/contexts/ThemeContext";
import { useThemeColors } from "@/lib/theme";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DynamicStatusBarProps {
    scrollY: Animated.Value;
    threshold?: number;
    defaultStyle?: "light" | "dark";
}

export function DynamicStatusBar({ scrollY, threshold = 200, defaultStyle = "light" }: DynamicStatusBarProps) {
    const { isDark } = useTheme();
    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const [style, setStyle] = useState<"light" | "dark">(defaultStyle);

    useEffect(() => {
        const listener = scrollY.addListener(({ value }) => {
            if (isDark) {
                if (style !== "light") setStyle("light");
                return;
            }

            const newStyle = value > threshold ? "dark" : "light";
            if (newStyle !== style) {
                setStyle(newStyle);
            }
        });

        return () => scrollY.removeListener(listener);
    }, [isDark, threshold, style]);

    const backgroundOpacity = scrollY.interpolate({
        inputRange: [threshold - 40, threshold],
        outputRange: [0, 1],
        extrapolate: "clamp",
    });

    const activeStyle = isDark ? "light" : style;

    return (
        <>
            <StatusBar style={activeStyle} />
            <Animated.View
                style={[
                    styles.background,
                    {
                        height: insets.top,
                        backgroundColor: colors.background,
                        opacity: backgroundOpacity,
                    },
                ]}
            />
        </>
    );
}

const styles = StyleSheet.create({
    background: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100, // High z-index to stay on top
    },
});
