import { useAuth } from "@/contexts/AuthContext";
import { getCrudItemsPaginated } from "@/lib/crud";
import { CrudFilters, CrudItem, PaginationOptions, SortOption } from "@/types/crud";
import { useCallback, useEffect, useState } from "react";

interface UseCrudItemsOptions {
    pageSize?: number;
    sort?: SortOption;
    filters?: CrudFilters;
    enabled?: boolean;
}

interface UseCrudItemsReturn {
    items: CrudItem[];
    loading: boolean;
    refreshing: boolean;
    error: Error | null;
    hasMore: boolean;
    total: number;
    loadMore: () => Promise<void>;
    refresh: () => Promise<void>;
}

export function useCrudItems(options: UseCrudItemsOptions = {}): UseCrudItemsReturn {
    const { user } = useAuth();
    const { pageSize = 20, sort = "newest", filters = {}, enabled = true } = options;

    const [items, setItems] = useState<CrudItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [total, setTotal] = useState(0);
    const [offset, setOffset] = useState(0);

    // Convert sort option to order by
    const getOrderBy = (): PaginationOptions["orderBy"] => {
        switch (sort) {
            case "newest":
                return { column: "created_at", ascending: false };
            case "oldest":
                return { column: "created_at", ascending: true };
            case "alphabetical":
                return { column: "title", ascending: true };
            default:
                return { column: sort, ascending: false };
        }
    };

    const fetchItems = useCallback(
        async (isRefresh: boolean = false) => {
            if (!user?.id || !enabled) return;

            try {
                const currentOffset = isRefresh ? 0 : offset;

                if (isRefresh) {
                    setRefreshing(true);
                } else if (currentOffset === 0) {
                    setLoading(true);
                }

                setError(null);

                const result = await getCrudItemsPaginated(user.id, currentOffset, {
                    pageSize,
                    orderBy: getOrderBy(),
                    filters,
                });

                if (isRefresh) {
                    setItems(result.data);
                    setOffset(result.data.length);
                } else if (currentOffset === 0) {
                    setItems(result.data);
                    setOffset(result.data.length);
                } else {
                    setItems((prev) => [...prev, ...result.data]);
                    setOffset((prev) => prev + result.data.length);
                }

                setHasMore(result.hasMore);
                setTotal(result.total || 0);
            } catch (err) {
                setError(err as Error);
                console.error("Error fetching CRUD items:", err);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [user?.id, offset, pageSize, sort, filters, enabled],
    );

    const loadMore = useCallback(async () => {
        if (!hasMore || loading || refreshing) return;
        await fetchItems(false);
    }, [hasMore, loading, refreshing, fetchItems]);

    const refresh = useCallback(async () => {
        setOffset(0);
        await fetchItems(true);
    }, [fetchItems]);

    // Initial load and when dependencies change
    useEffect(() => {
        setOffset(0);
        setItems([]);
        fetchItems(true);
    }, [user?.id, sort, JSON.stringify(filters), enabled]);

    return {
        items,
        loading,
        refreshing,
        error,
        hasMore,
        total,
        loadMore,
        refresh,
    };
}
