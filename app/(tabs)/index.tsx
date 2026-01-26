import { Button, Text } from "@/components/ui";
import { useTheme } from "@/contexts/ThemeContext";
import { spacing, useThemedStyles } from "@/lib/styles";
import { useThemeColors } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
    const router = useRouter();
    const { isDark } = useTheme();
    const colors = useThemeColors();

    const styles = useThemedStyles((colors) => ({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        scrollView: {
            flex: 1,
        },
        safeArea: {
            flex: 1,
        },
        content: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.xl,
            paddingTop: 60, // Account for status bar
        },
        welcomeSection: {
            alignItems: "center",
            marginBottom: spacing.xl,
        },
        appName: {
            textAlign: "center",
            marginBottom: spacing.md,
            fontSize: 48,
            fontWeight: "800",
            color: colors.primary,
        },
        description: {
            textAlign: "center",
            marginBottom: spacing.xl,
            paddingHorizontal: spacing.lg,
        },
        card: {
            backgroundColor: colors.backgroundSecondary,
            borderRadius: 16,
            padding: spacing.xl,
            marginBottom: spacing.md,
        },
        cardTitle: {
            fontSize: 20,
            fontWeight: "700",
            marginBottom: spacing.sm,
            textAlign: "center",
        },
        cardDescription: {
            textAlign: "center",
            marginBottom: spacing.lg,
        },
        buttonContainer: {
            gap: spacing.md,
        },
        featuresSection: {
            marginTop: spacing.xl,
        },
        featureItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
            backgroundColor: colors.backgroundSecondary,
            borderRadius: 12,
            marginBottom: spacing.sm,
        },
        featureIcon: {
            marginRight: spacing.md,
        },
        spacer: {
            height: 80,
        },
    }));

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.background} />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
                    <View style={styles.content}>
                        <View style={styles.welcomeSection}>
                            <Text variant="heading" style={styles.appName}>
                                Expo Supabase Starter
                            </Text>
                            <Text variant="body" color="secondary" style={styles.description}>
                                A complete starter template for React Native apps with Expo, Supabase authentication, and beautiful theming.
                            </Text>
                        </View>

                        <View style={styles.card}>
                            <Text variant="title" style={styles.cardTitle}>
                                🚀 Ready to Build
                            </Text>
                            <Text variant="body" color="secondary" style={styles.cardDescription}>
                                This template includes everything you need to get started with authentication, navigation, and a polished UI.
                            </Text>

                            <View style={styles.buttonContainer}>
                                <Button onPress={() => router.push("/sign-in")} variant="primary" size="lg" style={{ flex: 1 }}>
                                    Get Started
                                </Button>
                            </View>
                        </View>

                        <View style={styles.featuresSection}>
                            <Text variant="title" style={styles.cardTitle}>
                                ✨ Features Included
                            </Text>

                            <View style={styles.featureItem}>
                                <Ionicons name="lock-closed" size={24} color={colors.primary} style={styles.featureIcon} />
                                <Text variant="body" textBreakStrategy="simple">
                                    Email & Google authentication with Supabase
                                </Text>
                            </View>

                            <View style={styles.featureItem}>
                                <Ionicons name="color-palette" size={24} color={colors.primary} style={styles.featureIcon} />
                                <Text variant="body">Light/dark/system theme with persistence</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <Ionicons name="layers" size={24} color={colors.primary} style={styles.featureIcon} />
                                <Text variant="body">Reusable UI components and layouts</Text>
                            </View>

                            <View style={styles.featureItem}>
                                <Ionicons name="code" size={24} color={colors.primary} style={styles.featureIcon} />
                                <Text variant="body">TypeScript with strict mode enabled</Text>
                            </View>
                        </View>

                        <View style={styles.spacer} />
                    </View>
                </SafeAreaView>
            </ScrollView>
        </SafeAreaView>
    );
}
