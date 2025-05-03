import { TamaguiProvider, Theme } from '@tamagui/core';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import tamaguiConfig from '../tamagui.config';


export default function RootLayout() {
  
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={'light'}>
      
        <Stack>
          <Stack.Screen name="(main)/(tabs)" options={{ headerShown: true }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      
    </TamaguiProvider>
  );
}
