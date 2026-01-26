import { Theme, themes } from "@/lib/themes";
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
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@expo_supabase_starter_theme_preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
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

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system")) {
        setThemeState(savedTheme as ThemeMode);
        applyTheme(savedTheme as ThemeMode);
      } else {
        // Default to system
        applyTheme("system");
      }
    } catch (error) {
      console.error("Failed to load theme preference:", error);
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

  const isDark = colorScheme === "dark";
  const activeTheme = themes[colorScheme];

  // Don't render children until theme is loaded to prevent flash
  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, setTheme, isDark, colors: activeTheme }}>
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