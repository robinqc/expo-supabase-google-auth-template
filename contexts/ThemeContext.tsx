import { Theme, getThemeColors } from "@/lib/themes";
import { TintName, DEFAULT_TINT, TINT_NAMES } from "@/lib/tints";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { Appearance, View } from "react-native";

type ThemeMode = "light" | "dark" | "system";
type ColorScheme = "light" | "dark";

interface ThemeContextType {
  theme: ThemeMode;
  colorScheme: ColorScheme;
  setTheme: (theme: ThemeMode) => Promise<void>;
  isDark: boolean;
  colors: Theme;
  tint: TintName;
  setTint: (tint: TintName) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@expo_supabase_starter_theme_preference";
const TINT_STORAGE_KEY = "@expo_supabase_starter_tint_preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const [tint, setTintState] = useState<TintName>(DEFAULT_TINT);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme and tint preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  // Listen to system theme changes when in system mode
  useEffect(() => {
    if (theme === "system") {
      const subscription = Appearance.addChangeListener(({ colorScheme: systemScheme }) => {
        if (systemScheme) {
          setColorScheme(systemScheme as ColorScheme);
        }
      });

      return () => subscription.remove();
    }
  }, [theme]);

  const loadPreferences = async () => {
    try {
      const [savedTheme, savedTint] = await Promise.all([
        AsyncStorage.getItem(THEME_STORAGE_KEY),
        AsyncStorage.getItem(TINT_STORAGE_KEY),
      ]);

      // Load theme preference
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
        setThemeState(savedTheme as ThemeMode);
        applyTheme(savedTheme as ThemeMode);
      } else {
        // Default to system
        applyTheme("system");
      }

      // Load tint preference
      if (savedTint && TINT_NAMES.includes(savedTint as TintName)) {
        setTintState(savedTint as TintName);
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
      applyTheme("system");
    } finally {
      setIsLoading(false);
    }
  };

  const applyTheme = (newTheme: ThemeMode) => {
    if (newTheme === "system") {
      const systemScheme = Appearance.getColorScheme() || "dark";
      setColorScheme(systemScheme as ColorScheme);
    } else {
      setColorScheme(newTheme);
    }
  };

  const setTheme = async (newTheme: ThemeMode) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      applyTheme(newTheme);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  };

  const setTint = async (newTint: TintName) => {
    try {
      setTintState(newTint);
      await AsyncStorage.setItem(TINT_STORAGE_KEY, newTint);
    } catch (error) {
      console.error("Failed to save tint preference:", error);
    }
  };

  const isDark = colorScheme === "dark";
  const activeTheme = getThemeColors(colorScheme, tint);

  // Don't render children until preferences are loaded to prevent flash
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme, isDark, colors: activeTheme, tint, setTint }}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
