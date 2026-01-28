import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
    const { isDark, colors } = useTheme();
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: false,
                tabBarActiveTintColor: colors.foreground,
                tabBarInactiveTintColor: colors.foregroundTertiary,
                tabBarStyle: {
                    display: "flex",
                    flexDirection: "row",
                    backgroundColor: colors.backgroundSecondary,
                    borderWidth: 1,
                    borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)",
                    paddingVertical: 20,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t("tabs.home"),
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={20} color={color} />,
                }}
            />
            <Tabs.Screen
                name="crud"
                options={{
                    title: t("tabs.crud"),
                    href: user ? undefined : null,
                    tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={20} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t("tabs.profile"),
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={20} color={color} />,
                }}
            />
        </Tabs>
    );
}
