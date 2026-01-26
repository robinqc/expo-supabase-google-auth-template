import { Text } from "@/components/ui";
import { useTheme } from "@/contexts/ThemeContext";
import { borderRadius, layouts, spacing, useThemedStyles } from "@/lib/styles";
import { useThemeColors } from "@/lib/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ThemeOption = {
  value: "light" | "dark" | "system";
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const THEME_OPTIONS: ThemeOption[] = [
  {
    value: "light",
    label: "Light",
    description: "Always use light theme",
    icon: "sunny",
  },
  {
    value: "dark",
    label: "Dark",
    description: "Always use dark theme",
    icon: "moon",
  },
  {
    value: "system",
    label: "System",
    description: "Follow device setting",
    icon: "phone-portrait",
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { theme, setTheme, isDark } = useTheme();
  const colors = useThemeColors();

  const styles = useThemedStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
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
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.xl,
      overflow: 'hidden',
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
      alignItems: 'center',
    },
  }));

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    await setTheme(newTheme);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.icon} />
        </TouchableOpacity>
        <Text variant="heading" weight="extrabold">Settings</Text>
      </View>

      <ScrollView style={layouts.flex1}>
        {/* Appearance Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette" size={24} color={colors.primary} />
            <Text variant="title" weight="semibold" style={styles.sectionTitle}>Appearance</Text>
          </View>

          <View style={styles.optionsContainer}>
            {THEME_OPTIONS.map((option, index) => {
              const isSelected = theme === option.value;
              const isLast = index === THEME_OPTIONS.length - 1;

              return (
                <View key={option.value}>
                  <TouchableOpacity
                    onPress={() => handleThemeChange(option.value)}
                    style={styles.optionItem}
                    activeOpacity={0.7}
                  >
                    {/* Icon */}
                    <View
                      style={[
                        styles.optionIconContainer,
                        isSelected && styles.highlightedIconContainer
                      ]}
                    >
                      <Ionicons
                        name={option.icon}
                        size={24}
                        color={isSelected ? "#ffffff" : colors.iconSecondary}
                      />
                    </View>

                    {/* Label and Description */}
                    <View style={styles.optionTextContainer}>
                      <Text
                        variant="body"
                        weight="medium"
                        color={isSelected ? "primary" : "primary"}
                      >
                        {option.label}
                      </Text>
                      <Text variant="label" color="secondary" style={{ marginTop: 4 }}>
                        {option.description}
                      </Text>
                    </View>

                    {/* Check mark */}
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    )}
                  </TouchableOpacity>

                  {/* Divider */}
                  {!isLast && (
                    <View style={styles.divider} />
                  )}
                </View>
              );
            })}
          </View>

          {/* Current Theme Info */}
          <View style={styles.infoContainer}>
            <Ionicons name="information-circle" size={20} color={colors.info} />
            <Text variant="label" color="secondary" style={styles.infoText}>
              {theme === "system"
                ? `Currently using ${isDark ? "dark" : "light"} theme based on your device settings.`
                : `App will always use ${theme} theme.`}
            </Text>
          </View>
        </View>

        {/* Other Settings Sections (Placeholder) */}
        <View style={[styles.section, styles.borderTop]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications" size={24} color={colors.primary} />
            <Text variant="title" weight="semibold" style={styles.sectionTitle}>
              Notifications
            </Text>
          </View>
          <Text variant="body" color="secondary">
            Notification settings coming soon...
          </Text>
        </View>

        <View style={[styles.section, styles.borderTop]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="lock-closed" size={24} color={colors.primary} />
            <Text variant="title" weight="semibold" style={styles.sectionTitle}>Privacy</Text>
          </View>
          <Text variant="body" color="secondary">
            Privacy settings coming soon...
          </Text>
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text variant="label" color="tertiary">
            Expo Supabase Starter v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}