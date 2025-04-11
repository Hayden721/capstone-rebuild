import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider } from '@tamagui/core'
import { config } from '../tamagui.config';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native'
import { useTheme } from 'tamagui';
// root 레이아웃 (App.jsx 대용)

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 폰트 적용
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  
  
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  
  return (
    <SafeAreaProvider>
    <TamaguiProvider config={config} defaultTheme="light">
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </TamaguiProvider>
    </SafeAreaProvider>
  );
}

// function StatusLayout() {
//   const theme = useTheme();
//   return     <StatusBar
//   backgroundColor={theme.color12?.val} // Android 전용
//   barStyle="dark-content" // iOS 글자 색 (light-content or dark-content)
// />
// }