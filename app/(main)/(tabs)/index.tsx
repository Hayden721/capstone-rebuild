import { StyleSheet, View } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, 
  useTheme} from 'tamagui';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';





// 홈 화면
export default function home() {
const theme = useTheme();

  return (
    <SafeAreaView style={{flex:1, backgroundColor: theme.color1.val}}>
      <YStack>
        <XStack>
          <Text>최근 게시글</Text>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}