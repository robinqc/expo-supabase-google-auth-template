# Expo Supabase Starter

> A complete starter template for React Native apps with Expo, Supabase authentication, and beautiful theming.

## Features

- **🔐 Authentication**: Email + optional Google Sign-In with Supabase
- **🎨 Theming**: Light/Dark/System theme with persistence
- **🧭 Navigation**: Floating tab navigation with Home & Profile tabs
- **📱 Expo Go Compatible**: Works with Expo Go (no custom native code)
- **⚛️ TypeScript**: Strict mode enabled with full type safety
- **🎯 Ready to Build**: Production-ready configuration

## Quick Start

### Prerequisites

- Node.js 18+
- Expo Go app (from App Store/Play Store) or Expo CLI (`npm install -g @expo/cli`)
- Supabase account (free tier is sufficient)

### Installation

```bash
# Clone the template
git clone <your-repo-url> expo-supabase-starter
cd expo-supabase-starter

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start development server
npm start
```

### Environment Setup

1. **Create Supabase Project**:
    - Go to [supabase.com](https://supabase.com)
    - Create new project
    - Navigate to Project Settings → API
    - Copy your Project URL and Anon Key

2. **Configure Environment**:
    ```bash
    # Edit .env file
    nano .env
    ```
3. **Fill in your credentials**:

    ```env
    EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
    ```

4. **Run the app**:
    ```bash
    npm start
    ```

## Platform Setup

### Google Sign-In (Optional)

To enable Google authentication (web-based, works with Expo Go):

1. **Get Google Console Access**:
    - Visit [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
    - Create OAuth 2.0 Client ID
    - Select "Web application" type

2. **Configure OAuth Consent**:
    - Add your redirect URI in Google Console
    - For local development: `http://localhost:8081` (web) or `exp://localhost:8081` (mobile)
    - For production: your app's domain

3. **Add to .env**:
    ```env
    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-web-client-id
    ```

> **Note**: This template uses web-based OAuth that works with Expo Go. No native client IDs required.

## Project Structure

```
expo-supabase-starter/
├── app/                    # Expo Router screens
│   ├── (tabs)/           # Tab-based navigation
│   │   ├── _layout.tsx  # Tab navigator
│   │   ├── index.tsx    # Home screen
│   │   └── profile.tsx  # Profile screen
│   ├── _layout.tsx        # Root layout with providers
│   ├── sign-in.tsx         # Email + Google sign-in
│   ├── sign-up.tsx         # Email registration
│   └── settings.tsx        # Theme switcher
├── components/
│   └── ui/               # Reusable UI components
│       ├── Text.tsx      # Typography component
│       ├── Button.tsx    # Button variants
│       ├── Input.tsx     # Form inputs
│       ├── Card.tsx      # Container component
│       ├── FormView.tsx  # Form layout wrapper
│       └── index.ts       # Barrel exports
├── contexts/               # React Context providers
│   ├── AuthContext.tsx     # Authentication state
│   └── ThemeContext.tsx    # Theme management
├── lib/                   # Utility libraries
│   ├── supabase.ts         # Supabase client + helpers
│   ├── themes.ts           # Color definitions
│   ├── styles.ts           # Spacing, typography, etc.
│   ├── theme.ts            # Theme utilities
│   └── toast.ts            # Toast helpers
└── assets/
    └── images/           # App icons and images
        ├── icon.png         # App icon (1024x1024)
        ├── adaptive-icon.png # Android adaptive icon
        ├── favicon.png      # Web favicon (48x48)
        └── splash-icon.png  # Splash screen (200x200)
```

## Theming System

### Theme Types

- **Light**: Warm white backgrounds with dark text
- **Dark**: Dark blue-black backgrounds with white text
- **System**: Automatically follows device theme

### Theme Customization

Edit `lib/themes.ts` to modify colors:

```typescript
export const themes = {
    light: {
        // Change these colors for light theme
        primary: "#your-brand-color",
        background: "#ffffff",
        // ... more colors
    },
    dark: {
        // Change these colors for dark theme
        primary: "#your-brand-color-dark",
        background: "#000000",
        // ... more colors
    },
};
```

### Accessing Theme in Components

```typescript
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColors } from '@/lib/theme';

function MyComponent() {
  const { theme, setTheme } = useTheme();
  const colors = useThemeColors();

  // Use theme colors
  return <View style={{ backgroundColor: colors.background }}>
    <Text style={{ color: colors.foreground }}>
      Themed Text
    </Text>
  </View>;
}
```

## Authentication

### Included Features

- **Email Authentication**: Full email/password signup and signin
- **Google Sign-In**: Optional web-based OAuth (Expo Go compatible)
- **Session Persistence**: Automatic token refresh and session storage
- **User Profiles**: Complete user profile management system

### Auth Context API

```typescript
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signUp,
    signOut
  } = useAuth();

  // Check authentication state
  if (loading) return <LoadingSpinner />;
  if (!user) return <SignInPrompt />;

  return <AuthenticatedContent user={user} />;
}
```

### Profile Management

The template includes a complete user profile system:

```typescript
// User profile type
interface UserProfile {
    id: string;
    username: string | null;
    bio: string | null;
    name: string | null;
    avatar_url: string | null;
    cover_image_url: string | null;
    // ... more fields
}

// Profile helper functions
import { getUserProfile, updateUserProfile } from "@/lib/supabase";

// Usage in components
const profile = await getUserProfile(userId);
await updateUserProfile(userId, { name: "New Name" });
```

## UI Components

### Available Components

All components are theme-aware and accessible:

#### Text

Typography component with variants and weights:

```typescript
<Text variant="heading" weight="extrabold">Title</Text>
<Text variant="body" color="secondary">Description</Text>
```

#### Button

Multiple variants with loading states:

```typescript
<Button variant="primary" onPress={handlePress}>Primary</Button>
<Button variant="secondary" icon="settings">Settings</Button>
<Button loading={true}>Loading...</Button>
```

#### Input

Form inputs with validation:

```typescript
<Input label="Email" placeholder="Enter email" />
<Input label="Password" secureTextEntry error={errorMessage} />
```

#### Card

Container component with variants:

```typescript
<Card variant="elevated" padding="lg">Content</Card>
<Card variant="outlined">Border Content</Card>
```

#### FormView

Form layout wrapper:

```typescript
<FormView title="Sign Up" onBack={() => router.back()}>
  <Input label="Name" />
  <Button onPress={handleSubmit}>Submit</Button>
</FormView>
```

## Adding Features

### New Screen

1. Create file: `app/new-feature.tsx`
2. Add to tab navigator: `app/(tabs)/_layout.tsx`
3. Add navigation: `components/NavigationButtons.tsx`

```typescript
// app/new-feature.tsx
export default function NewFeatureScreen() {
  return (
    <SafeAreaView>
      <Text variant="title">New Feature</Text>
      {/* Your content */}
    </SafeAreaView>
  );
}

// app/(tabs)/_layout.tsx
<Tabs.Screen
  name="new-feature"
  options={{
    title: "New Feature",
    tabBarIcon: ({ color }) => (
      <Ionicons name="star" size={20} color={color} />
    ),
  }}
/>
```

### Protected Routes

Wrap screens that require authentication:

```typescript
import { useAuth } from '@/contexts/AuthContext';

function ProtectedScreen() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingView />;
  if (!user) return <SignInPrompt />;

  return <ProtectedContent />;
}
```

### New UI Component

1. Create component file: `components/ui/NewComponent.tsx`
2. Add to barrel export: `components/ui/index.ts`
3. Use in screens with full theme support

```typescript
// components/ui/NewComponent.tsx
import { useTheme } from '@/contexts/ThemeContext';
import { useThemedStyles } from '@/lib/styles';

interface NewComponentProps {
  title: string;
  onPress: () => void;
}

export function NewComponent({ title, onPress }: NewComponentProps) {
  const colors = useThemeColors();

  const styles = useThemedStyles((colors) => ({
    container: {
      backgroundColor: colors.card,
      padding: 16,
      borderRadius: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.foreground,
    },
  }));

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}
```

## Supabase Database Setup

### Required Tables

Create these tables in your Supabase project:

```sql
-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username TEXT UNIQUE,
  bio TEXT,
  name TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security

Enable RLS (Row Level Security) in Supabase:

```sql
-- Only users can read their own profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Only users can update their own profiles
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);
```

## 📦 Deployment

### EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure build
eas build:configure

# Build for all platforms
eas build --platform all

# Preview build
eas build --platform android --profile preview
```

### Environment Variables

For production, set these in your deployment environment:

```bash
# Supabase (required)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-production-key

# Google Sign-In (optional)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-production-web-client
```

## Configuration

### TypeScript Configuration

- **Strict mode** enabled for better type safety
- **Path aliases** configured: `@/` → root directory
- **React 19** with new JSX transform

### Expo Configuration

Key settings in `app.json`:

- **New Architecture**: Enabled for better performance
- **Gesture Handling**: Enhanced back gesture support
- **Type Safety**: Strict TypeScript checking

### Development Setup

```bash
# Fork and clone
git clone https://github.com/your-username/expo-supabase-starter.git
cd expo-supabase-starter

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/amazing-new-feature

# Make your changes
# ... develop ...

# Submit PR
git push origin feature/amazing-new-feature
```
