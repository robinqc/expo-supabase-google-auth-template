import { GOOGLE_AUTH_ENABLED, useAuth } from "@/contexts/AuthContext";
import { spacing, useThemedStyles } from "@/lib/styles";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, PasswordInput, Text } from "@robin-ux/native";
import { AuthApiError } from "@supabase/supabase-js";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as z from "zod";

const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignIn() {
    const { signIn, signInWithGoogle } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const passwordInput = useRef<TextInput>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const loginSchema = z.object({
        email: z.string().min(1, t("auth.emailRequired")).email(t("auth.invalidEmail")),
        password: z.string().min(6, t("auth.passwordMinLength")),
    });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

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

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        setGlobalError(null);
        try {
            await signIn(data.email, data.password);
            router.replace("/(tabs)");
        } catch (error: any) {
            if (error instanceof AuthApiError) {
                if (error.message === "Invalid login credentials") {
                    setGlobalError(t("auth.invalidCredentials"));
                }
                if (error.message === "Email not confirmed") {
                    setError("email", {
                        type: "manual",
                        message: t("auth.emailNotConfirmed"),
                    });
                }
            }
            Toast.show({
                type: "error",
                text1: t("auth.signInFailed"),
                text2: error.message || t("auth.anErrorOccurred"),
                position: "bottom",
            });
        } finally {
            setLoading(false);
        }
    };

    const onGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: t("auth.googleSignInFailed"),
                text2: error.message || t("auth.anErrorOccurred"),
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
                                {t("auth.welcomeBack")}
                            </Text>
                            <Text variant="body" color="secondary" style={styles.description}>
                                {t("auth.signInSubtitle")}
                            </Text>

                            <View style={styles.formContainer}>
                                <Input
                                    placeholder={t("auth.emailPlaceholder")}
                                    control={control}
                                    name="email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    textContentType="emailAddress"
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordInput.current?.focus()}
                                    label={t("auth.email")}
                                />
                                <PasswordInput
                                    placeholder={t("auth.password")}
                                    control={control}
                                    name="password"
                                    returnKeyType="done"
                                    onSubmitEditing={handleSubmit(onSubmit)}
                                    autoCapitalize="none"
                                    ref={passwordInput}
                                    label={t("auth.password")}
                                    error={errors.password?.message}
                                />
                            </View>

                            {globalError && (
                                <Text variant="label" color="error" style={{ marginTop: spacing.md }}>
                                    {globalError}
                                </Text>
                            )}
                            <View style={[styles.buttonContainer, { marginTop: spacing.lg }]}>
                                <Button onPress={handleSubmit(onSubmit)} variant="primary" size="md" loading={loading} style={{ flex: 1 }}>
                                    {t("auth.signIn")}
                                </Button>

                                {GOOGLE_AUTH_ENABLED && (
                                    <Button onPress={onGoogleSignIn} variant="secondary" icon="logo-google" size="lg" style={{ flex: 1 }}>
                                        {t("auth.signInWithGoogle")}
                                    </Button>
                                )}
                            </View>

                            <View style={styles.signUpButton}>
                                <Text color="secondary" style={styles.signUpText}>
                                    {t("auth.noAccount")}
                                </Text>
                                <Button onPress={onSignUp} variant="ghost">
                                    {t("auth.signUp")}
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
