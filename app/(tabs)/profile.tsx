import { Button, Text } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { spacing, useThemedStyles } from "@/lib/styles";
import { useThemeColors } from "@/lib/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
    const { user, userProfile, loading, signOut } = useAuth();
    const { isDark } = useTheme();
    const colors = useThemeColors();

    const passwordInput = useRef<any>(null);

    const [showSignInForm, setShowSignInForm] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signInLoading, setSignInLoading] = useState(false);

    const styles = useThemedStyles((colors): any => ({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        loadingContainer: {
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
        },
        center: {
            alignItems: "center",
            justifyContent: "center",
        },
        content: {
            flex: 1,
            padding: spacing.xl,
            paddingTop: 60,
        },
        profileCard: {
            backgroundColor: colors.backgroundSecondary,
            borderRadius: 20,
            padding: spacing.xl,
            alignItems: "center",
            marginBottom: spacing.lg,
        },
        avatarContainer: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.background,
            borderWidth: 3,
            borderColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.lg,
        },
        avatarText: {
            fontSize: 40,
            fontWeight: "700",
            color: colors.primary,
        },
        nameText: {
            fontSize: 24,
            fontWeight: "700",
            marginBottom: spacing.sm,
            textAlign: "center",
        },
        emailText: {
            fontSize: 16,
            color: colors.foregroundSecondary,
            textAlign: "center",
            marginBottom: spacing.lg,
        },
        buttonContainer: {
            gap: spacing.md,
            width: "100%",
            marginTop: spacing.xl,
        },
        signInFormContainer: {
            width: "100%",
            marginTop: spacing.lg,
        },
        signInForm: {
            gap: spacing.md,
        },
        signOutButton: {
            marginTop: spacing.lg,
            backgroundColor: colors.destructive,
            borderRadius: 12,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.xl,
            alignItems: "center",
        },
        signOutButtonText: {
            color: colors.destructiveForeground,
            fontSize: 16,
            fontWeight: "600",
        },
    }));

    const handleSignIn = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setSignInLoading(true);
        try {
            // This is a placeholder - you'd call the actual sign in function
            Alert.alert("Sign In", "Sign in functionality would be implemented here");
        } catch (error) {
            Alert.alert("Error", "Failed to sign in");
        } finally {
            setSignInLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style={isDark ? "light" : "dark"} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    if (!user) {
        return (
            <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
                <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.background} />
                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Text variant="heading" style={styles.avatarText}>
                                👤
                            </Text>
                        </View>

                        <Text variant="title" style={styles.nameText}>
                            Not Signed In
                        </Text>
                        <Text variant="body" color="secondary" style={styles.emailText}>
                            Sign in to access your profile
                        </Text>

                        <View style={styles.buttonContainer}>
                            <Button onPress={() => router.push("/sign-in")} variant="primary" size="lg">
                                Sign In
                            </Button>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    const userInitial = userProfile?.name?.[0] || user?.email?.[0] || "?";

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <StatusBar style={isDark ? "light" : "dark"} backgroundColor={colors.background} />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        {userProfile?.avatar_url ? (
                            <Image source={{ uri: userProfile.avatar_url }} style={{ width: "100%", height: "100%", borderRadius: 50 }} />
                        ) : (
                            <Text variant="heading" style={styles.avatarText}>
                                {userInitial}
                            </Text>
                        )}
                    </View>

                    <Text variant="title" style={styles.nameText}>
                        {userProfile?.name || user?.email || "User"}
                    </Text>

                    {userProfile?.bio && (
                        <Text variant="body" color="secondary" style={{ textAlign: "center", marginBottom: spacing.lg }}>
                            {userProfile.bio}
                        </Text>
                    )}

                    <View style={styles.buttonContainer}>
                        <Button onPress={() => router.push("/settings")} variant="secondary" icon="settings-outline" size="md">
                            Settings
                        </Button>
                    </View>

                    <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
                        <Text style={styles.signOutButtonText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
