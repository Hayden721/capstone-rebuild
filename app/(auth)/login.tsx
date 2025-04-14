import { StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, View, 
  useTheme, Input,
  Form} from 'tamagui';
// import { View, styled } from '@tamagui/core';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleButton } from '@/components/ThemeToggle';
 


export default function login() {
const theme = useTheme();

  return (
    
    <View flex={1} backgroundColor="$background">
      <Form
        alignItems='center'
        backgroundColor={theme.base1?.val}

      >
        <Image
          source={require('../../assets/images/logo/logo-non.png')}
          width={100}
          height={100}
        />

        <Text>hello</Text>
      </Form>

      <ThemeToggleButton/>


      </View>
      
  );
}


// <YStack jc="center" ai="center" px="$4" gap="$4" >
// <Text fontSize="$8" fontWeight="bold">로그인</Text>
// <Input placeholder="이메일" />
// <Input placeholder="비밀번호" secureTextEntry />
// <Button >로그인</Button>
// </YStack>