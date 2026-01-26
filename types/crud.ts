/**
 * CRUD Item Types
 */

export interface CrudItem {
    id: string;
    user_id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    category: string;
    status: "active" | "archived" | "draft";
    image_url: string | null;
    created_at: string;
    updated_at: string;
}

export type ViewMode = "list" | "grid" | "table";

export type SortOption = "newest" | "oldest" | "alphabetical" | string;

export interface SortableColumn {
    id: string;
    label: string;
    column: string;
    ascending?: boolean;
}

export interface TableColumn<T = any> {
    id: string;
    label: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    width?: number; // Fixed width in pixels
    minWidth?: number; // Minimum width
    flex?: number; // Flex grow factor
    align?: "left" | "center" | "right";
    sticky?: "left" | "right"; // Sticky position
}

export interface StickyColumnConfig {
    position: "left" | "right";
    columnId: string;
}

export type StatusFilter = "all" | "active" | "archived" | "draft";

export interface CrudFilters {
    status?: StatusFilter[];
    category?: string[];
    search?: string;
}

export interface CreateCrudItemInput {
    title: string;
    subtitle?: string;
    description?: string;
    category: string;
    status?: "active" | "archived" | "draft";
    image_url?: string;
}

export interface UpdateCrudItemInput {
    title?: string;
    subtitle?: string;
    description?: string;
    category?: string;
    status?: "active" | "archived" | "draft";
    image_url?: string;
}

export interface PaginationOptions {
    pageSize?: number;
    orderBy?: {
        column: string;
        ascending?: boolean;
    };
    filters?: CrudFilters;
}

export interface PaginatedResult<T> {
    data: T[];
    hasMore: boolean;
    total?: number;
}

// Common category options
export const CRUD_CATEGORIES = ["Design", "Engineering", "Marketing", "Product", "Research", "Finance", "Operations", "General"] as const;

export type CrudCategory = (typeof CRUD_CATEGORIES)[number];
