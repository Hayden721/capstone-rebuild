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



// '/'에 해당하는 파일
export default function home() {
const theme = useTheme();

  return (
    <View flex={1} backgroundColor="$color1">
      <YStack>
        <XStack>
          <Button theme="accent" onPress={() => router.push('/auth/login')}>테마 테스트</Button>
        </XStack>
      </YStack>
    </View>
  );
}