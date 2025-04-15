import { StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, View, 
  useTheme} from 'tamagui';
// import { View, styled } from '@tamagui/core';
import { useState } from 'react';
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { ThemeToggleButton } from '@/components/ThemeToggle';



// '/'에 해당하는 파일
export default function home() {
const theme = useTheme();

  return (
    <View flex={1} backgroundColor="$color1">
      <YStack>
        <XStack>
          <Button theme="accent" onPress={() => router.push('/(auth)/register')}><Text>회원가입</Text></Button>
          <ThemeToggleButton/>
        </XStack>
      </YStack>
    </View>
  );
}