import { StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, View, 
  useTheme} from 'tamagui';
// import { View, styled } from '@tamagui/core';
import { useLocalSearchParams, useRouter } from 'expo-router';
import FixedAddButton from '@/components/FixedAddButton';




// '/'에 해당하는 파일
export default function MajorDetail() {
const theme = useTheme();
const router = useRouter();
const { major } = useLocalSearchParams(); // "com", "elec"

  return (
  <View flex={1} backgroundColor={theme.color1?.val}>
    <YStack>
      <Text>{major} 게시판</Text>
    </YStack>

    {/* TODO: 고정된 게시글 추가 버튼 */}
    <FixedAddButton/>

  </View>
  );
}


