import React from 'react';
import { Link, Stack, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { Code, Home, Clipboard, AlertCircle, MessageCircle, User } from '@tamagui/lucide-icons' // Tamagui용 아이콘
import { useTheme } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';

// auth layout

export default function AuthLayout() {
  const theme = useTheme();

// 스크린에 오류 발생 시 +not-found.tsx 스크린으로 이동된다.
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.color1?.val}}  edges={['top']}>
    <Stack >
      <Stack.Screen name='login' options={{headerShown: false}}/>
      <Stack.Screen name='register' options={{
          headerShown: false,
        }}
        />
    </Stack>
    </SafeAreaView>
  );
}
