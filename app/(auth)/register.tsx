import { StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, View, 
  useTheme, Input} from 'tamagui';
// import { View, styled } from '@tamagui/core';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
 


export default function register() {
const theme = useTheme;

  return (
    <SafeAreaView>
    <YStack flex={1} jc="center" ai="center" px="$4" gap="$4" >
      <Text fontSize="$8" fontWeight="bold">회원가입</Text>
      <Input placeholder="이메일" />
      <Input placeholder="비밀번호" secureTextEntry />
      <Button width={250}>로그인</Button>
    </YStack>
    </SafeAreaView>
  );
}
