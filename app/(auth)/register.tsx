import { CustomHeader } from '@/components/CustomHeader';
import { firebaseSignUp } from '@/firebase/auth';
import { removeWhitespace, validateEmail } from '@/utils/validate';

import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, Separator, Label, RadioGroup, 
  Theme, AnimatePresence, Image, styled, useTheme, Input, H4
} from 'tamagui';
import { Check } from '@tamagui/lucide-icons';
import { useRouter } from 'expo-router';

export default function register() {
const theme = useTheme();
const router = useRouter();
const [email, setEmail] = useState<string>('');
const [password, setPassword] = useState<string>('');
const [chkPassword, setChkPassword] = useState('');


// 비밀번호 형식 확인 함수
const hasEmail = (email: string) => validateEmail(email);
const hasLetter = (password: string) => /[a-zA-Z]/.test(password);
const hasNumber = (password: string) => /[0-9]/.test(password);
const hasSymbol = (password: string) => /[^a-zA-Z0-9]/.test(password);
const matchPassword = (password: string, chkPassword: string) => {
  if(password === '' || chkPassword === ''){
    return false;
  }
  if(password === chkPassword) {
    return true;
  }
}

const handleSignUp = () => {
  const cleanEmail = removeWhitespace(email);

// 회원가입
  if(password === chkPassword && cleanEmail !== '') {
    firebaseSignUp(email, password);
    
    Alert.alert(
      '이메일 인증 필요',
      '이메일 인증 후 로그인해주세요',
      [{text:'확인', onPress: () => router.replace('/login')}]
    );

  } else {
    Alert.alert("비밀번호 확인이 일치하지 않습니다.");
  }
  
}

  return (
    <View style={{flex: 1, backgroundColor: theme.color1?.val}}>
      <CustomHeader title="" showBackButton={true}>

      </CustomHeader>
      
      <View style={{padding: 10}}>
        <H4 fontWeight={600}>회원가입</H4>
        {/* 학교 이메일 */}
        <YStack >
          <Label>학교 이메일</Label>
          <Input value={email} 
            onChangeText={setEmail} 
            placeholder='xxx@o.shinhan.ac.kr'
            autoCapitalize="none" // 대문자 자동 입력 방지
            />
          <XStack style={{alignItems:'center'}} >
            <Check color={hasEmail(email) ? '$accent1' : '#999'}/>
            <Text style={{color: hasEmail(email) ? theme.accent1.val : '#999'}}>이메일 형식</Text>
          </XStack>
        </YStack>

        <YStack>
          <Label>비밀번호</Label>
          <Input value={password} onChangeText={setPassword} placeholder='비밀번호' secureTextEntry/>
          <XStack>
            <XStack style={{alignItems: 'center'}}>
              <Check color= {hasLetter(password) ? '$accent1' : '#999'}/>
              <Text color={hasLetter(password) ? '$accent1' : '#999'}>영문포함</Text>
            </XStack>
            <XStack style={{alignItems:'center', marginLeft:10}}>
              <Check color={hasNumber(password) ? '$accent1' : '#999'}/>
              <Text color={hasNumber(password) ? '$accent1' : '#999'}>숫자포함</Text>
            </XStack>
            <XStack style={{alignItems:'center', marginLeft:10}}>
              <Check color={hasSymbol(password) ? '$accent1' : '#999'}/>
              <Text color={hasSymbol(password) ? '$accent1' : '#999'}>특수문자</Text>
            </XStack>
          </XStack>
        </YStack>

        <YStack>
          <Label>비밀번호 확인</Label>
          <Input value={chkPassword} onChangeText={setChkPassword} placeholder='비밀번호 확인' secureTextEntry/>
          <XStack style={{alignItems:'center'}}>
            <Check color={matchPassword(password, chkPassword) ? '$accent1' : '#999'}/>
            <Text color={matchPassword(password, chkPassword) ? '$accent1' : '#999'}>비밀번호 확인</Text>
          </XStack>
        </YStack>

        <Button onPress={handleSignUp} style={{marginTop:20, backgroundColor:theme.accent1.val}}>회원가입</Button>

      </View>
    </View>
  );
}
