import { StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, Theme, AnimatePresence, Image, styled, useTheme, Input, Form, View,
  ButtonText} from 'tamagui';

import { useState } from 'react';
import { ThemeToggleButton } from '@/components/ThemeToggle';
import { useThemeContext } from '../../hooks/useThemeContext';
import { useRouter } from 'expo-router';
import {firebaseLogin} from '../../firebase/auth';

// 로그인 스크린
export default function Login() {
  const {themeMode} = useThemeContext();
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fullEmail = email + '@o.shinhan.ac.kr';
  const handleLogin = async () => {
    try {
      const user = await firebaseLogin(fullEmail, password);
      
    } catch (error) {
      console.log("로그인 실패", error);
    }
  }

  return (
    
    <View flex={1} style={{backgroundColor: theme.color1.val}}>
      <YStack style={{flex: 1, alignItems: 'center', marginTop: 20}}>
      <Image
        source={
          themeMode === 'light' ? 
          require('../../assets/images/logo/connect-logo-black-nonbg.png') : 
          require('../../assets/images/logo/connect-logo-white-nonbg.png')
        }
        width={100}
        height={100}
      />
      <Form flex={1} width={300}>
        <Label fontSize={15}><Text style={{color: theme.color12.val}}>Email</Text></Label>
        <XStack style={{maxWidth:300, alignItems: 'center'}}>
          <Input width={134} value={email} onChangeText={setEmail} style={styles.loginInput} />
          <Text fontSize={20} style={{fontSize:20, padding:4}}>@</Text>
          <Input flex={1} value='o.shinhan.ac.kr' 
            style={styles.loginInput} disabled/>
        </XStack>
        <Label fontSize={15}><Text style={{color: theme.color12.val}}>Password</Text></Label>
        <Input value={password} onChangeText={setPassword} secureTextEntry
          placeholder='password' 
          style={styles.loginInput} />

        <Button onPress={handleLogin} style={{marginTop:15, backgroundColor: theme.accent1.val}}><Text color={'white'}>로그인</Text></Button>
        <XStack style={{justifyContent: "space-between", alignItems: "center", marginTop: 8}} >
          <TouchableOpacity >
            <Text>아이디 | 비밀번호 찾기</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {router.push('/(auth)/register')}}>
            <Text style={[styles.bottomBtn ,{fontWeight:100, fontSize: 15, color: theme.color12?.val}]}>회원가입</Text>
          </TouchableOpacity>
        </XStack>
      </Form>
      
      </YStack>
    </View>
  );
}

const styles = StyleSheet.create({
  loginInput: {
    height: 50,
    fontSize: 14, // 폰트 사이즈
    
    paddingVertical: 0,
    textAlignVertical: 'center',
  },
  bottomBtn: {
    fontFamily: 'NotoSans'
  }
});