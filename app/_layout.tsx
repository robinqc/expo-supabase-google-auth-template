import { ThemeProvider as RobinThemeProvider } from "@robin-ux/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { AuthProvider } from "../contexts/AuthContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useEffect(() => {
        // Hide splash screen immediately since we're not loading custom fonts
        SplashScreen.hideAsync();
    }, []);

    return (
        <LanguageProvider>
            <ThemeProvider>
                <AuthProvider>
                    <RootLayoutNav />
                    <Toast />
                </AuthProvider>
            </ThemeProvider>
        </LanguageProvider>
    );
}

function RootLayoutNav() {
    const theme = useTheme();

    return (
        <RobinThemeProvider theme={theme}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
        </RobinThemeProvider>
    );
}
