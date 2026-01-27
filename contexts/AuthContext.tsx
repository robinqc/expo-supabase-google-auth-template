import { Session, User } from "@supabase/supabase-js";
import * as Crypto from "expo-crypto";
import * as WebBrowser from "expo-web-browser";
import { router } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";
import i18n from "../lib/i18n";
import { getUserProfile, supabase, UserProfile } from "../lib/supabase";

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

// Configuration flag for Google Sign-In
export const GOOGLE_AUTH_ENABLED = !!process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

interface AuthContextType {
    user: User | null;
    session: Session | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // No configuration needed for web-based Google OAuth
    }, []);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            } else {
                setUserProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId: string) => {
        const profile = await getUserProfile(userId);
        setUserProfile(profile);
        setLoading(false);
    };

    const refreshUserProfile = async () => {
        if (user) {
            await fetchUserProfile(user.id);
        }
    };

    const signInWithGoogle = async () => {
        try {
            console.log("Starting Google Sign In...");

            if (!GOOGLE_AUTH_ENABLED) {
                throw new Error(i18n.t("auth.googleSignInNotEnabled"));
            }

            // Use Supabase OAuth with Google
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: typeof window !== 'undefined' 
                        ? window.location.origin 
                        : 'exp://localhost:8081', // Expo Go fallback
                },
            });

            if (error) {
                console.error("Supabase sign-in error:", error);
                throw error;
            }

            // Open OAuth URL in web browser
            if (data?.url) {
                const result = await WebBrowser.openAuthSessionAsync(
                    data.url,
                    typeof window !== 'undefined' 
                        ? window.location.origin 
                        : 'exp://localhost:8081'
                );
                
                if (result.type === 'success') {
                    // User completed authentication, session should be set automatically
                    router.replace("/(tabs)");
                } else {
                    throw new Error(i18n.t("auth.authCancelled"));
                }
            }
        } catch (error: any) {
            console.error("Google sign-in error:", error);
            throw error;
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            // Sign in with email and password
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Supabase sign-in error:", error);
                throw error;
            }
        } catch (error: any) {
            console.error("Sign-in error:", error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string) => {
        try {
            // Sign up with email and password
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                console.error("Supabase sign-up error:", error);
                throw error;
            }

            console.log("Sign up successful!", data.session?.user?.email);
        } catch (error: any) {
            console.error("Sign-up error:", error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            // Sign out from Supabase
            await supabase.auth.signOut();

            console.log("Sign out successful");
        } catch (error) {
            console.error("Error signing out:", error);
            throw error;
        }
    };

    return <AuthContext.Provider value={{ user, session, userProfile, loading, signInWithGoogle, signOut, refreshUserProfile, signIn, signUp }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}