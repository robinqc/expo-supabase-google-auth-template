import { Card } from "@/components/ui";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { LanguageCode } from "@/lib/i18n";
import { borderRadius, layouts, spacing, useThemedStyles } from "@/lib/styles";
import { useThemeColors } from "@/lib/theme";
import { TINT_NAMES, TintName, tintMeta } from "@/lib/tints";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@robin-ux/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ThemeOption = {
    value: "light" | "dark" | "system";
    label: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
};

type LanguageOption = {
    value: LanguageCode;
    label: string;
    nativeName: string;
    icon: keyof typeof Ionicons.glyphMap;
};

type TintOption = {
    value: TintName;
    label: string;
    swatch: string;
};

export default function SettingsScreen() {
    const router = useRouter();
    const { theme, setTheme, isDark, tint, setTint } = useTheme();
    const { language, setLanguage } = useLanguage();
    const { t } = useTranslation();
    const colors = useThemeColors();

    const THEME_OPTIONS: ThemeOption[] = [
        {
            value: "light",
            label: t("settings.light"),
            description: t("settings.lightDescription"),
            icon: "sunny",
        },
        {
            value: "dark",
            label: t("settings.dark"),
            description: t("settings.darkDescription"),
            icon: "moon",
        },
        {
            value: "system",
            label: t("settings.system"),
            description: t("settings.systemDescription"),
            icon: "phone-portrait",
        },
    ];

    const LANGUAGE_OPTIONS: LanguageOption[] = [
        {
            value: "en",
            label: t("settings.english"),
            nativeName: "English",
            icon: "language",
        },
        {
            value: "es",
            label: t("settings.spanish"),
            nativeName: "Espanol",
            icon: "language",
        },
    ];

    const TINT_OPTIONS: TintOption[] = TINT_NAMES.map((name) => ({
        value: name,
        label: t(`settings.tint${tintMeta[name].label}`),
        swatch: tintMeta[name].swatch,
    }));

    const styles = useThemedStyles((colors) => ({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            flexDirection: "row",
            alignItems: "center",
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        backButton: {
            marginRight: spacing.md,
        },
        section: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
        },
        sectionHeader: {
            ...layouts.rowCenter,
            marginBottom: spacing.md,
        },
        sectionTitle: {
            marginLeft: spacing.sm,
        },
        optionsContainer: {
            paddingHorizontal: 0,
            paddingVertical: 0,
            overflow: "hidden",
        },
        optionItem: {
            padding: spacing.md,
            ...layouts.rowCenter,
        },
        optionIconContainer: {
            width: 48,
            height: 48,
            borderRadius: borderRadius.full,
            ...layouts.center,
            backgroundColor: colors.background,
        },
        highlightedIconContainer: {
            backgroundColor: colors.primary,
        },
        optionTextContainer: {
            flex: 1,
            marginLeft: spacing.md,
        },
        divider: {
            height: 1,
            backgroundColor: colors.border,
            marginLeft: 80, // 48 (icon) + 16 (padding) + 16 (margin)
        },
        infoContainer: {
            marginTop: spacing.md,
            padding: spacing.md,
            backgroundColor: colors.backgroundSecondary,
            borderRadius: borderRadius.xl,
            ...layouts.rowCenter,
        },
        infoText: {
            marginLeft: spacing.md,
            flex: 1,
        },
        borderTop: {
            borderTopWidth: 1,
            borderTopColor: colors.border,
        },
        versionContainer: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.lg,
            alignItems: "center",
        },
        tintSection: {
            marginTop: spacing.lg,
        },
        tintLabel: {
            marginBottom: spacing.sm,
        },
        tintContainer: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: spacing.md,
            borderRadius: borderRadius.xl,
            padding: spacing.md,
        },
        tintCircle: {
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: "center",
            alignItems: "center",
            borderWidth: 3,
            borderColor: "transparent",
        },
        tintCircleSelected: {
            borderColor: colors.foreground,
        },
    }));

    const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
        await setTheme(newTheme);
    };

    const handleLanguageChange = async (newLanguage: LanguageCode) => {
        await setLanguage(newLanguage);
    };

    const handleTintChange = async (newTint: TintName) => {
        await setTint(newTint);
    };

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <StatusBar style={isDark ? "light" : "dark"} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.icon} />
                </TouchableOpacity>
                <Text variant="heading" weight="extrabold">
                    {t("settings.title")}
                </Text>
            </View>

            <ScrollView style={layouts.flex1}>
                {/* Appearance Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="color-palette" size={24} color={colors.primary} />
                        <Text variant="title" weight="semibold" style={styles.sectionTitle}>
                            {t("settings.appearance")}
                        </Text>
                    </View>

                    <Card variant="outlined" style={styles.optionsContainer}>
                        {THEME_OPTIONS.map((option, index) => {
                            const isSelected = theme === option.value;
                            const isLast = index === THEME_OPTIONS.length - 1;

                            return (
                                <View key={option.value}>
                                    <TouchableOpacity onPress={() => handleThemeChange(option.value)} style={styles.optionItem} activeOpacity={0.7}>
                                        {/* Icon */}
                                        <View style={[styles.optionIconContainer, isSelected && styles.highlightedIconContainer]}>
                                            <Ionicons name={option.icon} size={24} color={isSelected ? "#ffffff" : colors.iconSecondary} />
                                        </View>

                                        {/* Label and Description */}
                                        <View style={styles.optionTextContainer}>
                                            <Text variant="body" weight="medium" color={isSelected ? "primary" : "primary"}>
                                                {option.label}
                                            </Text>
                                            <Text variant="label" color="secondary" style={{ marginTop: 4 }}>
                                                {option.description}
                                            </Text>
                                        </View>

                                        {/* Check mark */}
                                        {isSelected && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
                                    </TouchableOpacity>

                                    {/* Divider */}
                                    {!isLast && <View style={styles.divider} />}
                                </View>
                            );
                        })}
                    </Card>

                    {/* Current Theme Info */}
                    <Card variant="outlined" style={styles.infoContainer}>
                        <Ionicons name="information-circle" size={20} color={colors.info} />
                        <Text variant="label" color="secondary" style={styles.infoText}>
                            {theme === "system" ? (isDark ? t("settings.usingDarkTheme") : t("settings.usingLightTheme")) : t("settings.appWillUseTheme", { theme })}
                        </Text>
                    </Card>

                    {/* Accent Color / Tint Selection */}
                    <View style={styles.tintSection}>
                        <Text variant="body" weight="medium" style={styles.tintLabel}>
                            {t("settings.accentColor")}
                        </Text>
                        <Card variant="outlined" style={styles.tintContainer}>
                            {TINT_OPTIONS.map((option) => {
                                const isSelected = tint === option.value;
                                return (
                                    <TouchableOpacity
                                        key={option.value}
                                        onPress={() => handleTintChange(option.value)}
                                        style={[styles.tintCircle, { backgroundColor: option.swatch }, isSelected && styles.tintCircleSelected]}
                                        activeOpacity={0.7}
                                        accessibilityLabel={option.label}
                                        accessibilityRole="button"
                                        accessibilityState={{ selected: isSelected }}
                                    >
                                        {isSelected && <Ionicons name="checkmark" size={20} color="#ffffff" />}
                                    </TouchableOpacity>
                                );
                            })}
                        </Card>
                    </View>
                </View>

                {/* Language Section */}
                <View style={[styles.section, styles.borderTop]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="language" size={24} color={colors.primary} />
                        <Text variant="title" weight="semibold" style={styles.sectionTitle}>
                            {t("settings.language")}
                        </Text>
                    </View>

                    <Card variant="outlined" style={styles.optionsContainer}>
                        {LANGUAGE_OPTIONS.map((option, index) => {
                            const isSelected = language === option.value;
                            const isLast = index === LANGUAGE_OPTIONS.length - 1;

                            return (
                                <View key={option.value}>
                                    <TouchableOpacity onPress={() => handleLanguageChange(option.value)} style={styles.optionItem} activeOpacity={0.7}>
                                        {/* Icon */}
                                        <View style={[styles.optionIconContainer, isSelected && styles.highlightedIconContainer]}>
                                            <Ionicons name={option.icon} size={24} color={isSelected ? "#ffffff" : colors.iconSecondary} />
                                        </View>

                                        {/* Label and Description */}
                                        <View style={styles.optionTextContainer}>
                                            <Text variant="body" weight="medium" color={isSelected ? "primary" : "primary"}>
                                                {option.label}
                                            </Text>
                                            <Text variant="label" color="secondary" style={{ marginTop: 4 }}>
                                                {option.nativeName}
                                            </Text>
                                        </View>

                                        {/* Check mark */}
                                        {isSelected && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
                                    </TouchableOpacity>

                                    {/* Divider */}
                                    {!isLast && <View style={styles.divider} />}
                                </View>
                            );
                        })}
                    </Card>
                </View>

                {/* Other Settings Sections (Placeholder) */}
                <View style={[styles.section, styles.borderTop]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="notifications" size={24} color={colors.primary} />
                        <Text variant="title" weight="semibold" style={styles.sectionTitle}>
                            {t("settings.notifications")}
                        </Text>
                    </View>
                    <Text variant="body" color="secondary">
                        {t("settings.notificationsComingSoon")}
                    </Text>
                </View>

                <View style={[styles.section, styles.borderTop]}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="lock-closed" size={24} color={colors.primary} />
                        <Text variant="title" weight="semibold" style={styles.sectionTitle}>
                            {t("settings.privacy")}
                        </Text>
                    </View>
                    <Text variant="body" color="secondary">
                        {t("settings.privacyComingSoon")}
                    </Text>
                </View>

                {/* Version Info */}
                <View style={styles.versionContainer}>
                    <Text variant="label" color="tertiary">
                        {t("settings.appVersion")}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
