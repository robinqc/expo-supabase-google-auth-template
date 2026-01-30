import { useAuth } from "@/contexts/AuthContext";
import { createCrudItem, getCrudItem, updateCrudItem } from "@/lib/crud";
import { spacing, useThemedStyles } from "@/lib/styles";
import { showToast } from "@/lib/toast";
import { CRUD_CATEGORIES, CreateCrudItemInput } from "@/types/crud";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormView, Input, TextArea } from "@robin-ux/native";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { z } from "zod";

const crudItemSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    subtitle: z.string().max(200, "Subtitle is too long").optional(),
    description: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    status: z.enum(["draft", "active", "archived"]),
});

type CrudItemFormData = z.infer<typeof crudItemSchema>;

export default function CrudCreatePage() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const params = useLocalSearchParams<{ id?: string; mode?: string }>();
    const isEditMode = params.mode === "edit" && !!params.id;
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);

    const crudItemSchema = z.object({
        title: z.string().min(1, t("crud.titleRequired")).max(100, t("crud.titleTooLong")),
        subtitle: z.string().max(200, t("crud.subtitleTooLong")).optional(),
        description: z.string().optional(),
        category: z.string().min(1, t("crud.categoryRequired")),
        status: z.enum(["draft", "active", "archived"]),
    });

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CrudItemFormData>({
        resolver: zodResolver(crudItemSchema),
        defaultValues: {
            title: "",
            subtitle: "",
            description: "",
            category: CRUD_CATEGORIES[0],
            status: "draft",
        },
    });

    const styles = useThemedStyles((colors) => ({
        form: {
            gap: spacing.lg,
        },
        row: {
            flexDirection: "row",
            gap: spacing.md,
        },
        halfWidth: {
            flex: 1,
        },
        footer: {
            flexDirection: "row",
            gap: spacing.md,
        },
        button: {
            flex: 1,
        },
    }));

    // Load existing item if in edit mode
    useEffect(() => {
        const loadItem = async () => {
            if (!isEditMode || !params.id || !user?.id) return;

            try {
                setInitialLoading(true);
                const item = await getCrudItem(params.id, user.id);
                if (item) {
                    reset({
                        title: item.title,
                        subtitle: item.subtitle || "",
                        description: item.description || "",
                        category: item.category,
                        status: item.status,
                    });
                } else {
                    showToast.error(t("crud.itemNotFound"));
                    router.back();
                }
            } catch (error) {
                console.error("Error loading item:", error);
                showToast.error(t("crud.loadFailed"));
                router.back();
            } finally {
                setInitialLoading(false);
            }
        };

        loadItem();
    }, [isEditMode, params.id, user?.id]);

    const onSubmit = async (data: CrudItemFormData) => {
        if (!user?.id) {
            showToast.error(t("crud.mustBeLoggedIn"));
            return;
        }

        try {
            setLoading(true);

            if (isEditMode && params.id) {
                await updateCrudItem(params.id, user.id, data);
                showToast.success(t("crud.itemUpdated"));
            } else {
                await createCrudItem(user.id, data as CreateCrudItemInput);
                showToast.success(t("crud.itemCreated"));
            }

            router.back();
        } catch (error) {
            console.error("Error saving item:", error);
            showToast.error(isEditMode ? t("crud.updateFailed") : t("crud.createFailed"));
        } finally {
            setLoading(false);
        }
    };

    const categoryOptions = CRUD_CATEGORIES.map((cat) => ({
        label: t(`categories.${cat.toLowerCase()}`),
        value: cat,
    }));

    const statusOptions = [
        { label: t("status.draft"), value: "draft" },
        { label: t("status.active"), value: "active" },
        { label: t("status.archived"), value: "archived" },
    ];

    return (
        <FormView
            title={isEditMode ? t("crud.editItem") : t("crud.createItem")}
            onBack={() => router.back()}
            loading={loading || initialLoading}
            footer={
                <View style={styles.footer}>
                    <Button variant="secondary" onPress={() => router.back()} style={styles.button} disabled={loading}>
                        {t("common.cancel")}
                    </Button>
                    <Button variant="primary" onPress={handleSubmit(onSubmit)} style={styles.button} loading={loading}>
                        {isEditMode ? t("common.update") : t("common.create")}
                    </Button>
                </View>
            }
        >
            <View style={styles.form}>
                <Input control={control} name="title" label={t("crud.title_field")} placeholder={t("crud.titlePlaceholder")} />

                <Input control={control} name="subtitle" label={t("crud.subtitle")} placeholder={t("crud.subtitlePlaceholder")} />

                <TextArea control={control} name="description" label={t("crud.descriptionLabel")} placeholder={t("crud.descriptionPlaceholder")} minHeight={120} />

                <View style={styles.row}>
                    {/* <Select
            control={control}
            name="category"
            label="Category"
            options={categoryOptions}
            style={styles.halfWidth}
          />

          <Select
            control={control}
            name="status"
            label="Status"
            options={statusOptions}
            style={styles.halfWidth}
          /> */}
                </View>
            </View>
        </FormView>
    );
}
