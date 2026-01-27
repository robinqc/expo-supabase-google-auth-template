import { Button, Input, PasswordInput, Text } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { spacing, useThemedStyles } from "@/lib/styles";
import { router } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { zodResolver } from "@hookform/resolvers/zod";
import { AuthApiError } from "@supabase/supabase-js";
import { useForm } from "react-hook-form";
import { z } from "zod";

const signUpSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string().min(6, "Password must be at least 6 characters long"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type SignUpForm = z.infer<typeof signUpSchema>;

export default function SignUp() {
    const { signUp } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const passwordInput = useRef<TextInput>(null);
    const confirmPasswordInput = useRef<TextInput>(null);

    const signUpSchema = z
        .object({
            name: z.string().min(3, t("auth.nameMinLength")),
            email: z.string().email(t("auth.invalidEmailAddress")),
            password: z.string().min(6, t("auth.passwordMinLength")),
            confirmPassword: z.string().min(6, t("auth.passwordMinLength")),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: t("auth.passwordsDoNotMatch"),
            path: ["confirmPassword"],
        });

    const {
        control,
        handleSubmit,
        formState: { errors },
        setError,
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
    });

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

    const onSubmit = useCallback(
        async (data: SignUpForm) => {
            setLoading(true);
            try {
                await signUp(data.email, data.password);
                Toast.show({
                    type: "success",
                    text1: t("auth.accountCreated"),
                    text2: t("auth.checkEmailToVerify"),
                    position: "bottom",
                });
                router.replace("/sign-in");
            } catch (error: any) {
                if (error instanceof AuthApiError) {
                    setError("email", {
                        type: "manual",
                        message: error.message,
                    });
                }
                Toast.show({
                    type: "error",
                    text1: t("auth.signUpFailed"),
                    text2: error.message || t("auth.anErrorOccurred"),
                    position: "bottom",
                });
            } finally {
                setLoading(false);
            }
        },
        [signUp, t],
    );

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
                                {t("auth.createAccount")}
                            </Text>
                            <Text variant="body" color="secondary" style={styles.description}>
                                {t("auth.createAccountSubtitle")}
                            </Text>

                            <View style={styles.formContainer}>
                                <Input
                                    placeholder={t("auth.name")}
                                    control={control}
                                    name="name"
                                    autoCapitalize="words"
                                    returnKeyType="next"
                                    onSubmitEditing={() => passwordInput.current?.focus()}
                                    label={t("auth.name")}
                                />
                                <Input
                                    placeholder={t("auth.email")}
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
                                    returnKeyType="next"
                                    onSubmitEditing={() => confirmPasswordInput.current?.focus()}
                                    ref={passwordInput}
                                    label={t("auth.password")}
                                />
                                <PasswordInput
                                    placeholder={t("auth.confirmPassword")}
                                    control={control}
                                    name="confirmPassword"
                                    returnKeyType="done"
                                    onSubmitEditing={handleSubmit(onSubmit)}
                                    ref={confirmPasswordInput}
                                    label={t("auth.confirmPassword")}
                                />
                            </View>

                            <View style={styles.buttonContainer}>
                                <Button onPress={handleSubmit(onSubmit)} variant="primary" size="md" loading={loading} style={{ flex: 1 }}>
                                    {t("auth.createAccount")}
                                </Button>
                            </View>

                            <View style={styles.signInButton}>
                                <Text color="secondary" style={styles.signInText}>
                                    {t("auth.haveAccount")}
                                </Text>
                                <Button onPress={onSignIn} variant="ghost">
                                    {t("auth.signIn")}
                                </Button>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
