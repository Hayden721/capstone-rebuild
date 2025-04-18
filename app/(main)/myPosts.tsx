import { StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, View, 
  useTheme} from 'tamagui';
// import { View, styled } from '@tamagui/core';
import { useRouter } from 'expo-router';




// '/'에 해당하는 파일
export default function myPosts() {
const theme = useTheme();
const router = useRouter();
//로그아웃
  return (
  <View flex={1} backgroundColor="$background">
    <YStack>
      <Text>Mypost Test</Text>
    </YStack>
  </View>
  );
}


