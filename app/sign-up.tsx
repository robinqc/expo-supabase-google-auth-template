import { Button, Input, PasswordInput, Text } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { spacing, useThemedStyles } from "@/lib/styles";
import { useThemeColors } from "@/lib/theme";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function SignUp() {
    const { signUp } = useAuth();

    const colors = useThemeColors();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const passwordInput = useRef<TextInput>(null);
    const confirmPasswordInput = useRef<TextInput>(null);

    const styles = useThemedStyles((colors) => ({
        scrollContent: {
            flexGrow: 1,
            justifyContent: "center",
        },
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        safeArea: {
            flex: 1,
        },
        content: {
            flex: 1,
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.xl,
            paddingTop: 80,
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
            width: "100%",
            display: "flex",
        },
        buttonContainer: {
            gap: spacing.md,
            marginTop: spacing.xl,
        },
        signInButton: {
            marginTop: spacing.lg,
            alignItems: "center",
        },
        signInText: {
            textAlign: "center",
            marginTop: spacing.md,
        },
    }));

    const onSubmit = useCallback(async () => {
        if (!email || !name || !password || !confirmPassword) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Please fill in all fields",
                position: "bottom",
            });
            return;
        }

        if (password !== confirmPassword) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Passwords do not match",
                position: "bottom",
            });
            return;
        }

        if (password.length < 6) {
            Toast.show({
                type: "error",
                text1: "Error",
                text2: "Password must be at least 6 characters",
                position: "bottom",
            });
            return;
        }

        setLoading(true);
        try {
            await signUp(email, password);
            Toast.show({
                type: "success",
                text1: "Account Created",
                text2: "Please check your email to verify your account",
                position: "bottom",
            });
            router.replace("/sign-in");
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Sign Up Failed",
                text2: error.message || "An error occurred",
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    }, [email, name, password, confirmPassword, signUp]);

    const onSignIn = () => {
        router.push("/sign-in");
    };

    return (
        <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
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
                                Create Account
                            </Text>
                            <Text variant="body" color="secondary" style={styles.description}>
                                Join us and get started with your new account
                            </Text>

                            <View style={styles.formContainer}>
                                <Input
                                    placeholder="Name"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="words"
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordInput.current?.focus()}
                                    label="Name"
                                />
                                <Input
                                    placeholder="Email"
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
                                <PasswordInput
                                    placeholder="Password"
                                    value={password}
                                    onChangeText={setPassword}
                                    returnKeyType="next"
                                    onSubmitEditing={() => confirmPasswordInput.current?.focus()}
                                    ref={passwordInput}
                                    label="Password"
                                />
                                <PasswordInput
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    returnKeyType="done"
                                    onSubmitEditing={onSubmit}
                                    ref={confirmPasswordInput}
                                    label="Confirm Password"
                                />
                            </View>

                            <View style={styles.buttonContainer}>
                                <Button onPress={onSubmit} variant="primary" size="md" loading={loading} style={{ flex: 1 }}>
                                    Create Account
                                </Button>
                            </View>

                            <View style={styles.signInButton}>
                                <Text color="secondary" style={styles.signInText}>
                                    Already have an account?
                                </Text>
                                <Button onPress={onSignIn} variant="ghost">
                                    Sign In
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
