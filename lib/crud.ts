import {
  CreateCrudItemInput,
  CrudFilters,
  CrudItem,
  PaginatedResult,
  PaginationOptions,
  UpdateCrudItemInput,
} from '@/types/crud';
import { supabase } from './supabase';

/**
 * Fetch paginated CRUD items
 */
export async function getCrudItems(
  userId: string,
  options: PaginationOptions = {}
): Promise<PaginatedResult<CrudItem>> {
  try {
    const {
      pageSize = 20,
      orderBy = { column: 'created_at', ascending: false },
      filters = {},
    } = options;

    let query = supabase
      .from('crud_items')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (filters.status && filters.status.length > 0 && !filters.status.includes('all')) {
      query = query.in('status', filters.status);
    }

    if (filters.category && filters.category.length > 0) {
      query = query.in('category', filters.category);
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,subtitle.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    // Apply sorting
    query = query.order(orderBy.column, { ascending: orderBy.ascending });

    // Apply pagination
    query = query.limit(pageSize);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching CRUD items:', error);
      throw error;
    }

    return {
      data: data || [],
      hasMore: (data?.length || 0) >= pageSize,
      total: count || 0,
    };
  } catch (error) {
    console.error('Error fetching CRUD items:', error);
    throw error;
  }
}

/**
 * Fetch paginated CRUD items with offset
 */
export async function getCrudItemsPaginated(
  userId: string,
  offset: number = 0,
  options: PaginationOptions = {}
): Promise<PaginatedResult<CrudItem>> {
  try {
    const {
      pageSize = 20,
      orderBy = { column: 'created_at', ascending: false },
      filters = {},
    } = options;

    let query = supabase
      .from('crud_items')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (filters.status && filters.status.length > 0 && !filters.status.includes('all')) {
      query = query.in('status', filters.status);
    }

    if (filters.category && filters.category.length > 0) {
      query = query.in('category', filters.category);
    }

    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,subtitle.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
      );
    }

    // Apply sorting
    query = query.order(orderBy.column, { ascending: orderBy.ascending });

    // Apply pagination
    query = query.range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching CRUD items:', error);
      throw error;
    }

    return {
      data: data || [],
      hasMore: offset + (data?.length || 0) < (count || 0),
      total: count || 0,
    };
  } catch (error) {
    console.error('Error fetching CRUD items:', error);
    throw error;
  }
}

/**
 * Fetch a single CRUD item by ID
 */
export async function getCrudItem(
  itemId: string,
  userId: string
): Promise<CrudItem | null> {
  try {
    const { data, error } = await supabase
      .from('crud_items')
      .select('*')
      .eq('id', itemId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching CRUD item:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching CRUD item:', error);
    return null;
  }
}

/**
 * Create a new CRUD item
 */
export async function createCrudItem(
  userId: string,
  input: CreateCrudItemInput
): Promise<CrudItem> {
  try {
    const { data, error } = await supabase
      .from('crud_items')
      .insert({
        user_id: userId,
        title: input.title,
        subtitle: input.subtitle || null,
        description: input.description || null,
        category: input.category,
        status: input.status || 'draft',
        image_url: input.image_url || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating CRUD item:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating CRUD item:', error);
    throw error;
  }
}

/**
 * Update an existing CRUD item
 */
export async function updateCrudItem(
  itemId: string,
  userId: string,
  updates: UpdateCrudItemInput
): Promise<CrudItem> {
  try {
    const { data, error } = await supabase
      .from('crud_items')
      .update(updates)
      .eq('id', itemId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating CRUD item:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating CRUD item:', error);
    throw error;
  }
}

/**
 * Delete a CRUD item
 */
export async function deleteCrudItem(
  itemId: string,
  userId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('crud_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting CRUD item:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error deleting CRUD item:', error);
    throw error;
  }
}