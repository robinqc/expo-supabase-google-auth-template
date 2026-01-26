import { Button, Input, Text } from "@/components/ui";
import { GOOGLE_AUTH_ENABLED, useAuth } from "@/contexts/AuthContext";
import { spacing, useThemedStyles } from "@/lib/styles";
import { useThemeColors } from "@/lib/theme";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function SignIn() {
    const { signIn, signInWithGoogle } = useAuth();

    const colors = useThemeColors();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const passwordInput = useRef<TextInput>(null);
    const [showPassword, setShowPassword] = useState(false);

    const styles = useThemedStyles((colors) => ({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        safeArea: {
            flex: 1,
        },
        content: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.xl,
            paddingTop: 40,
        },
        scrollContent: {
            flexGrow: 1,
            justifyContent: "center",
        },
        logoContainer: {
            alignItems: "center",
            marginBottom: spacing.xl,
        },
        logo: {
            width: 120,
            height: 120,
            borderRadius: 20,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: spacing.md,
        },
        logoText: {
            fontSize: 48,
            fontWeight: "800",
            color: colors.background,
        },
        title: {
            textAlign: "center",
            marginBottom: spacing.sm,
        },
        description: {
            textAlign: "center",
            marginBottom: spacing.xl,
            paddingHorizontal: spacing.lg,
        },
        formContainer: {
            gap: spacing.md,
        },
        buttonContainer: {
            gap: spacing.md,
        },
        signUpButton: {
            marginTop: spacing.lg,
            alignItems: "center",
        },
        signUpText: {
            textAlign: "center",
            marginTop: spacing.md,
        },
    }));

    const onSubmit = useCallback(async () => {
        if (!email || !password) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Please fill in all fields",
                position: "bottom",
            });
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
            router.replace("/(tabs)");
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Sign In Failed",
                text2: error.message || "An error occurred",
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    }, [email, password, signIn]);

    const onGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Google Sign In Failed",
                text2: error.message || "An error occurred",
                position: "bottom",
            });
        }
    };

    const onSignUp = () => {
        router.push("/sign-up");
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
            <StatusBar style="auto" />
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        <View style={styles.content}>
                            <View style={styles.logoContainer}>
                                <View style={styles.logo}>
                                    <Text style={styles.logoText}>S</Text>
                                </View>
                            </View>

                            <Text variant="heading" style={styles.title}>
                                Welcome Back
                            </Text>
                            <Text variant="body" color="secondary" style={styles.description}>
                                Sign in to your account to continue
                            </Text>

                            <View style={styles.formContainer}>
                                <Input
                                    placeholder="example@gmail.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="emailAddress"
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordInput.current?.focus()}
                                    label="Email"
                                />
                                <Input
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    returnKeyType="done"
                                    onSubmitEditing={onSubmit}
                                    autoCapitalize="none"
                                    ref={passwordInput}
                                    endElement={<Button variant="ghost" icon="eye" size="sm" onPress={() => setShowPassword(!showPassword)} />}
                                    label="Password"
                                />
                            </View>

                            <View style={[styles.buttonContainer, { marginTop: spacing.lg }]}>
                                <Button onPress={onSubmit} variant="primary" size="md" loading={loading} style={{ flex: 1 }}>
                                    Sign In
                                </Button>

                                {GOOGLE_AUTH_ENABLED && (
                                    <Button onPress={onGoogleSignIn} variant="secondary" icon="logo-google" size="lg" style={{ flex: 1 }}>
                                        Sign in with Google
                                    </Button>
                                )}
                            </View>

                            <View style={styles.signUpButton}>
                                <Text color="secondary" style={styles.signUpText}>
                                    Don't have an account?
                                </Text>
                                <Button onPress={onSignUp} variant="ghost">
                                    Sign Up
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
