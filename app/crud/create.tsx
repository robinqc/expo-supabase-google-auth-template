import { Button } from "@/components/ui/Button";
import { FormView } from "@/components/ui/FormView";
import { Input } from "@/components/ui/Input";
import { TextArea } from "@/components/ui/TextArea";
import { useAuth } from "@/contexts/AuthContext";
import { createCrudItem, getCrudItem, updateCrudItem } from "@/lib/crud";
import { spacing, useThemedStyles } from "@/lib/styles";
import { showToast } from "@/lib/toast";
import { CRUD_CATEGORIES, CreateCrudItemInput } from "@/types/crud";
import { zodResolver } from "@hookform/resolvers/zod";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
    const params = useLocalSearchParams<{ id?: string; mode?: string }>();
    const isEditMode = params.mode === "edit" && !!params.id;
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(isEditMode);

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
                    showToast.error("Item not found");
                    router.back();
                }
            } catch (error) {
                console.error("Error loading item:", error);
                showToast.error("Failed to load item");
                router.back();
            } finally {
                setInitialLoading(false);
            }
        };

        loadItem();
    }, [isEditMode, params.id, user?.id]);

    const onSubmit = async (data: CrudItemFormData) => {
        if (!user?.id) {
            showToast.error("You must be logged in");
            return;
        }

        try {
            setLoading(true);

            if (isEditMode && params.id) {
                await updateCrudItem(params.id, user.id, data);
                showToast.success("Item updated");
            } else {
                await createCrudItem(user.id, data as CreateCrudItemInput);
                showToast.success("Item created");
            }

            router.back();
        } catch (error) {
            console.error("Error saving item:", error);
            showToast.error(isEditMode ? "Failed to update item" : "Failed to create item");
        } finally {
            setLoading(false);
        }
    };

    const categoryOptions = CRUD_CATEGORIES.map((cat) => ({
        label: cat,
        value: cat,
    }));

    const statusOptions = [
        { label: "Draft", value: "draft" },
        { label: "Active", value: "active" },
        { label: "Archived", value: "archived" },
    ];

    return (
        <FormView
            title={isEditMode ? "Edit Item" : "Create Item"}
            onBack={() => router.back()}
            loading={loading || initialLoading}
            footer={
                <View style={styles.footer}>
                    <Button variant="secondary" onPress={() => router.back()} style={styles.button} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="primary" onPress={handleSubmit(onSubmit)} style={styles.button} loading={loading}>
                        {isEditMode ? "Update" : "Create"}
                    </Button>
                </View>
            }
        >
            <View style={styles.form}>
                <Input control={control} name="title" label="Title" placeholder="Enter item title" />

                <Input control={control} name="subtitle" label="Subtitle" placeholder="Enter subtitle (optional)" />

                <TextArea control={control} name="description" label="Description" placeholder="Enter detailed description..." minHeight={120} />

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
