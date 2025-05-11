import React from 'react';
import { useFonts } from 'expo-font';
import { Redirect, Slot, Stack, useRouter, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { TamaguiProvider, Theme } from '@tamagui/core'
import { tamaguiConfig } from '../tamagui.config';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, useColorScheme } from 'react-native'
import { useAuth } from '../hooks/useAuth';
import { ThemeProvider } from '../contexts/ThemeContext';
import { useThemeContext } from '../hooks/useThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { PortalProvider } from '@tamagui/portal';
// root 레이아웃 (최상위 레이아웃)

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  // 폰트 로딩
  const [loaded, error] = useFonts({
    NotoSans: require('../assets/fonts/NanumGothic-Regular.ttf'),
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
  const { user, loading } = useAuth(); // 로그인 상태
  const { themeMode } = useThemeContext(); // 테마 상태 
  const router = useRouter();
  console.log("로그인 상태 : ", user);
  const pathname = usePathname();
  console.log(pathname);

  // 개발할 떄만 사용 (스크린 고정할 때 사용)
  const [isLayoutMounted, setIsLayoutMounted] = useState(false);
    // 컴포넌트 마운트 완료 감지
    useEffect(() => {
      if (loaded && !loading) {
        SplashScreen.hideAsync(); // 모든 준비 끝난 후 Splash 숨김
        // 마운트 완료 표시를 약간 지연
        return setIsLayoutMounted(true);
      }
    }, [loaded, loading]);
  
    // 마운트 완료 후에만 경로 리디렉션 실행
    useEffect(() => {
      if (__DEV__ && isLayoutMounted) {
        // 안전한 시점에서 리디렉션
        const redirectTimer = setTimeout(() => {
          // if (pathname !== '/major/com/ivTalbdY0B5YucotCOzV') {
          //   console.log('Redirecting to development screen...');
          //   router.replace('/major/com/ivTalbdY0B5YucotCOzV');
          // }
          if(pathname !== '/my') {
            router.replace('/(main)/(tabs)/my');
          }
        }, 100);
        
        return () => clearTimeout(redirectTimer);
      }
    }, [pathname, isLayoutMounted]);

  // 배포할 때 사용 
  // useEffect(() => {
  //   if (loaded && !loading) {
  //     SplashScreen.hideAsync(); // 모든 준비 끝난 후 Splash 숨김
  //   }
  // }, [loaded, loading]);

  useEffect(() => {
    if(!loading && loaded) {
      if(user) {
        router.replace('/(main)/(tabs)/(board)'); // 로그인 상태면 메인 스크린으로 이동
      }else {
        router.replace('/(auth)/login') // 로그인 상태 아니면 로그인 스크린으로 이동
      }
    }
  }, [user, loaded, loading])
  // 배포할 때 사용  -------------------------
  if (loading || !loaded) return null; // 로딩이 되지 않았으면 렌더링 하지 않는다.

  return (
    <SafeAreaProvider>
      <TamaguiProvider config={tamaguiConfig} defaultTheme={themeMode}>
        <PortalProvider>
          <StatusBar
            barStyle={themeMode === 'light' ? 'dark-content' : 'light-content'}
            translucent
            backgroundColor="transparent"
          />

          <Stack screenOptions={{ 
            headerShown: false,
            animation: 'default',
            }}
          >
            <Stack.Screen name="(auth)"/> 
            <Stack.Screen name="(main)"/>  
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> 
          </Stack>
        </PortalProvider>
      </TamaguiProvider>
    </SafeAreaProvider>
  )
}


