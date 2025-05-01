import { StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, Theme, AnimatePresence, Image, styled, View, useTheme, Input, Form} from 'tamagui';
// import { View, styled } from '@tamagui/core';
import { useState } from 'react';
import { ThemeToggleButton } from '@/components/ThemeToggle';
import { useThemeContext } from '../../hooks/useThemeContext';
import { useRouter } from 'expo-router';
import {firebaseLogin} from '../../firebase/auth';


export default function Login() {
  const {themeMode} = useThemeContext();
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await firebaseLogin(email, password);
      console.log("로그인 성공", user.email);
      router.replace('/(main)/(tabs)/home');

    } catch (error) {
      Alert.alert("로그인 실패", error.message);
    }
  }

  return (
    <View flex={1} backgroundColor="$background">
      <Form
        alignItems='center'
        backgroundColor={theme.base1?.val}>
        <Image
          source={
            themeMode === 'light' ? 
            require('../../assets/images/logo/connect-logo-black-nonbg.png') : 
            require('../../assets/images/logo/connect-logo-white-nonbg.png')
          }
          width={100}
          height={100}
        />
        
        <YStack width={300}> 
          <YStack>
            <Label fontWeight="600" fontSize="$5" htmlFor='email'>
              <Text>이메일</Text>
            </Label>  
            <Input id='email' value={email} onChangeText={setEmail} placeholder='Email' backgroundColor={theme.color1?.val} height={50} fontSize="$4" fontWeight="400"/>
          </YStack>

          <YStack>
            <Label fontWeight="600" fontSize="$5" htmlFor='password'>
              <Text>비밀번호</Text>
            </Label>
              <Input id='password' value={password} onChangeText={setPassword} placeholder='Password' backgroundColor={theme.color1?.val}     
                height={50} fontSize="$4" fontWeight="400" secureTextEntry/>
          </YStack>

          <YStack marginTop={10}>
            <Button theme="accent" backgroundColor="$color1" onPress={handleLogin}>
              <Text fontWeight="700" fontSize="$6" color="white">
                로그인
              </Text>
            </Button>
          </YStack>

          <YStack marginTop={10}>
          <XStack justifyContent="space-between" alignItems="center" width="100%">
  <Text
    fontWeight="500"
    fontSize="$5"
    color="$color"
    onPress={() => {
      // 아이디 / 비밀번호 찾기 눌렀을 때
    }}
  >
    아이디 | 비밀번호 찾기
  </Text>

  <TouchableOpacity
    onPress={() => {router.push('/(auth)/register')}}>
    <Text style={{fontWeight: 600, fontSize: 16, color: theme.color12?.val}}>회원가입</Text>
  </TouchableOpacity>
</XStack>
          </YStack>
      </YStack>
      </Form>

      <ThemeToggleButton/>
      </View>
      
      
  );
}