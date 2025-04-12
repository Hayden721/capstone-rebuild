import { StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, View, 
  useTheme, Input} from 'tamagui';
// import { View, styled } from '@tamagui/core';
import { useState } from 'react';




export default function login() {
const theme = useTheme;

  return (
    <YStack f={1} jc="center" ai="center" px="$4" gap="$4">
      <Text fontSize="$8" fontWeight="bold">로그인</Text>
      <Input placeholder="이메일" width={250} />
      <Input placeholder="비밀번호" width={250} secureTextEntry />
      <Button width={250}>로그인</Button>
    </YStack>
  );
}
