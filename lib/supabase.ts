import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

// User Profile Types
export interface UserProfile {
    id: string;
    username: string | null;
    bio: string | null;
    cover_image_url: string | null;
    avatar_url: string | null;
    is_public: boolean;
    created_at: string;
    name: string | null;
    location: string | null;
    social_link: string | null;
}

// Check if username is available (not taken by another user)
export async function checkUsernameAvailability(username: string, currentUserId: string): Promise<boolean> {
    try {
        const { data, error } = await supabase.from("user_profiles").select("id").eq("username", username).neq("id", currentUserId).single();

        if (error && error.code !== "PGRST116") {
            console.error("Error checking username availability:", error);
            return false;
        }

        // If no data found, username is available
        return !data;
    } catch (error) {
        console.error("Error checking username availability:", error);
        return false;
    }
}

// Update user profile data
export async function updateUserProfile(
    userId: string,
    updates: {
        name?: string;
        username?: string;
        bio?: string;
        location?: string;
        social_link?: string;
        is_public?: boolean;
        avatar_url?: string;
        cover_image_url?: string;
    },
): Promise<UserProfile | null> {
    try {
        const { data, error } = await supabase.from("user_profiles").update(updates).eq("id", userId).select().single();

        if (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
}

// Fetch user profile data
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
        const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single();

        if (error) {
            console.log("Error fetching user profile:", error);
            return null;
        }

        return data;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

// Create user profile (usually called after successful sign-up)
export async function createUserProfile(
    userId: string,
    profile: {
        name?: string;
        username?: string;
        bio?: string;
        avatar_url?: string;
        cover_image_url?: string;
    },
): Promise<UserProfile | null> {
    try {
        const { data, error } = await supabase
            .from("user_profiles")
            .insert({
                id: userId,
                username: profile.username || null,
                name: profile.name || null,
                bio: profile.bio || null,
                avatar_url: profile.avatar_url || null,
                cover_image_url: profile.cover_image_url || null,
                is_public: false, // Default to private
            })
            .select()
            .single();

        if (error) {
            console.error("Error creating user profile:", error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error("Error creating user profile:", error);
        throw error;
    }
}
