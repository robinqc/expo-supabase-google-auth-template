import { Card } from "@/components/ui/Card";
import { DetailRow } from "@/components/ui/DetailRow";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { deleteCrudItem, getCrudItem } from "@/lib/crud";
import { borderRadius, spacing, useThemedStyles } from "@/lib/styles";
import { showToast } from "@/lib/toast";
import { CrudItem } from "@/types/crud";
import { Ionicons } from "@expo/vector-icons";
import { Button, Text } from "@robin-ux/native";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Alert, Pressable, ScrollView, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CrudDetailPage() {
    const { user } = useAuth();
    const { isDark, colors } = useTheme();
    const { t } = useTranslation();
    const params = useLocalSearchParams<{ id: string }>();
    const [item, setItem] = useState<CrudItem | null>(null);
    const [loading, setLoading] = useState(true);

    const styles = useThemedStyles((colors) => ({
        container: {
            flex: 1,
            backgroundColor: colors.background,
        },
        header: {
            height: 200,
            backgroundColor: colors.backgroundSecondary,
        },
        headerGradient: {
            flex: 1,
            padding: spacing.lg,
            justifyContent: "space-between",
        },
        headerTop: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        iconButton: {
            width: 40,
            height: 40,
            borderRadius: borderRadius.full,
            backgroundColor: colors.card + "50",
            alignItems: "center",
            justifyContent: "center",
        },
        cardContainer: {
            marginTop: -40,
            marginHorizontal: spacing.lg,
        },
        cardContent: {
            gap: spacing.md,
        },
        cardHeader: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: spacing.sm,
        },
        dateContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: spacing.xs,
        },
        dateText: {
            color: colors.foregroundSecondary,
            fontSize: 12,
        },
        title: {
            color: colors.foreground,
            fontSize: 24,
            fontWeight: "700",
            lineHeight: 32,
            marginBottom: spacing.xs,
        },
        subtitle: {
            color: colors.foregroundSecondary,
            fontSize: 14,
            lineHeight: 20,
        },
        content: {
            padding: spacing.lg,
            gap: spacing.xl,
        },
        section: {
            gap: spacing.md,
        },
        sectionTitle: {
            color: colors.foregroundTertiary,
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 1,
        },
        description: {
            color: colors.foreground,
            fontSize: 16,
            lineHeight: 24,
        },
        detailsCard: {
            gap: 0,
        },
        actions: {
            flexDirection: "row",
            gap: spacing.md,
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.xl,
        },
        actionButton: {
            flex: 1,
        },
        loadingContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
        },
    }));

    useEffect(() => {
        const loadItem = async () => {
            if (!params.id || !user?.id) return;

            try {
                setLoading(true);
                const data = await getCrudItem(params.id, user.id);
                if (data) {
                    setItem(data);
                } else {
                    showToast.error(t("crud.itemNotFound"));
                    router.back();
                }
            } catch (error) {
                console.error("Error loading item:", error);
                showToast.error(t("crud.loadFailed"));
                router.back();
            } finally {
                setLoading(false);
            }
        };

        loadItem();
    }, [params.id, user?.id]);

    const handleEdit = () => {
        if (!item) return;
        router.push({
            pathname: "/crud/create" as any,
            params: { id: item.id, mode: "edit" },
        });
    };

    const handleDelete = () => {
        if (!item || !user?.id) return;

        Alert.alert(t("crud.deleteItem"), t("crud.deleteConfirmation"), [
            { text: t("common.cancel"), style: "cancel" },
            {
                text: t("common.delete"),
                style: "destructive",
                onPress: async () => {
                    try {
                        await deleteCrudItem(item.id, user.id);
                        showToast.success(t("crud.itemDeleted"));
                        router.back();
                    } catch (error) {
                        showToast.error(t("crud.deleteFailed"));
                        console.error("Error deleting item:", error);
                    }
                },
            },
        ]);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container} edges={["top"]}>
                <StatusBar style={isDark ? "light" : "dark"} />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.foreground} />
                </View>
            </SafeAreaView>
        );
    }

    if (!item) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container} edges={["top"]}>
            <StatusBar style={isDark ? "light" : "dark"} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerGradient}>
                        <View style={styles.headerTop}>
                            <Pressable style={styles.iconButton} onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={20} color={colors.foreground} />
                            </Pressable>
                            <Pressable style={styles.iconButton}>
                                <Ionicons name="ellipsis-horizontal" size={20} color={colors.foreground} />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* Card */}
                <Animated.View entering={FadeIn.duration(300)} style={styles.cardContainer}>
                    <Card variant="outlined" padding="lg" style={styles.cardContent}>
                        <View style={styles.cardHeader}>
                            <StatusBadge status={item.status} />
                            <View style={styles.dateContainer}>
                                <Ionicons name="calendar-outline" size={12} color={colors.foregroundSecondary} />
                                <Text style={styles.dateText}>{formatDate(item.created_at)}</Text>
                            </View>
                        </View>
                        <Text style={styles.title}>{item.title}</Text>
                        {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
                    </Card>
                </Animated.View>

                {/* Content */}
                <View style={styles.content}>
                    {/* Description */}
                    {item.description && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t("crud.descriptionLabel")}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    )}

                    {/* Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t("crud.details")}</Text>
                        <Card variant="outlined" padding="md" style={styles.detailsCard}>
                            <DetailRow label={t("crud.category")} value={item.category} icon="pricetag-outline" />
                            <DetailRow label={t("crud.id")} value={`#${item.id.substring(0, 8)}`} showDivider={false} />
                        </Card>
                    </View>
                </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.actions}>
                <Button variant="secondary" icon="create-outline" onPress={handleEdit} style={styles.actionButton}>
                    {t("common.edit")}
                </Button>
                <Button variant="destructive" icon="trash-outline" onPress={handleDelete} style={styles.actionButton}>
                    {t("common.delete")}
                </Button>
            </View>
        </SafeAreaView>
    );
}
