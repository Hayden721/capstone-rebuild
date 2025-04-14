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
import { ThemeProvider, useThemeContext } from '../context/ThemeContext';

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
    return null; // 폰트가 로딩 중이면 아무것도 렌더링 하지 않음
  }
  
  
  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
);
}

function RootLayoutNav() {
  const { user, loading } = useAuth(); // useAuth 훅 사용
  const { theme } = useThemeContext();
  
  // useEffect(() => {
  //   if(loading && !user) {
  //     router.push('/(auth)/login');
  //   }
  // })
  if(loading) return null // 로딩 중이면 렌더링 하지 않음


// 삼항 연산자를 사용해서 로그인 상태에 따라 네이베이션 호출
  return (
    <SafeAreaProvider>
      <TamaguiProvider config={config} defaultTheme={theme}>
        <StatusBar
          barStyle={theme === 'light' ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        
        {!user ? (
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
          ) : (
          <Stack>
            <Stack.Screen name="(auth)" options={{headerShown: false}}/>
          </Stack>
        )}      

          {/* <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack> */}
          {/* <Stack>
            <Stack.Screen name="(auth)" options={{headerShown: false}}/>
          </Stack> */}
        
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}


