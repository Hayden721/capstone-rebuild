import { StyleSheet } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, View, 
  useTheme} from 'tamagui';
import { useRouter } from 'expo-router';




// '/'에 해당하는 파일
export default function MyComments() {
const theme = useTheme();
const router = useRouter();
//로그아웃
  return (
  <View style={{flex:1, backgroundColor: theme.color1.val}}>
    <YStack>
      <Text>Mypost Test</Text>
    </YStack>
  </View>
  );
}


