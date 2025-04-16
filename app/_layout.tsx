import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Redirect, Slot, Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider } from '@tamagui/core'
import { config } from '../tamagui.config';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native'
import { useAuth } from '../hooks/useAuth';
import { useTheme } from 'tamagui';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useThemeContext } from '../hooks/useThemeContext';
import { AuthProvider } from '../contexts/AuthContext';

// root 레이아웃 (App.jsx 대용)

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';


export default function RootLayout() {
  
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });
  

  if (!loaded) {
    return null;
  }
  if (error) throw error;
  return (
    <AuthProvider >
      <ThemeProvider>
        <RootLayoutNav loaded={loaded} />
      </ThemeProvider>
    </AuthProvider>
  );
}

function RootLayoutNav({ loaded }: { loaded: boolean }) {
  const { user, loading } = useAuth();
  const { themeMode } = useThemeContext();
  console.log("로그인 상태 : ", user);
  
  useEffect(() => {
    if (loaded && !loading) {
      SplashScreen.hideAsync(); // 모든 준비 끝난 후 Splash 숨김
    }
  }, [loaded, loading]);


  if (loading || !loaded) return null;

  return (
    <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme={themeMode}>
        <StatusBar
          barStyle={themeMode === 'light' ? 'dark-content' : 'light-content'}
          translucent
          backgroundColor="transparent"
        />
        {user ? 
          <Redirect href="/(tabs)"/>
        :
          <Redirect href="/(auth)"/>  
        }

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}


