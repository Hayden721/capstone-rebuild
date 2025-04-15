import { StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, View, 
  useTheme, Input, H1} from 'tamagui';
// import { View, styled } from '@tamagui/core';
import { useState } from 'react';


 


export default function register() {
const theme = useTheme();

  return (
    <View flex={1} backgroundColor="$background">
      <YStack>
        <Text>회원가입 스크린</Text>
      </YStack>
      </View>
  );
}
