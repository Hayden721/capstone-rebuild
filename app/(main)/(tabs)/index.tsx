import { StyleSheet, View } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, 
  useTheme} from 'tamagui';
// import { View, styled } from '@tamagui/core';
import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { ThemeToggleButton } from '@/components/ThemeToggle';


// 홈 화면
export default function home() {
const theme = useTheme();

  return (
    <View style={{flex: 1, backgroundColor: theme.color1.val}}>
      <YStack>
        <XStack>
          <ThemeToggleButton/>
        </XStack>
      </YStack>
    </View>
  );
}