import { Alert, StyleSheet, TouchableOpacity, KeyboardAvoidingView, 
  Platform, TouchableWithoutFeedback, Keyboard} from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, H5,
  Separator, Theme, AnimatePresence, Image, styled, View, 
  useTheme, ScrollView,
  H6, Group} from 'tamagui';

import { useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import Divider from '@/components/Divider';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import BoardList from '@/components/BoardList';
import { BookText } from '@tamagui/lucide-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getDetailPost } from '@/firebase/firestore';
import { postProps } from '@/type/firebaseType';
import { format } from 'date-fns';

export default function detail() {
const theme = useTheme();
const router = useRouter();
const { major, postId } = useLocalSearchParams<{major: string, postId: string}>();

const [postDetail, setPostDetail] = useState<postProps | null>(null);

console.log("detail major, id test : ", major, postId);

useEffect(() => {
  if (!__DEV__) {
    router.replace(`/major/${major}/${postId}`);
  }
}, []); // ✅ 개발 중일 땐 이동 막음

useEffect(() => {
  const fetchPost = async () => {
    const post = await getDetailPost(major, postId);
    setPostDetail(post);
    console.log("가져온 게시물 데이터 : ", post);
  }

  fetchPost();
}, [major, postId]);

  return (
    <KeyboardAvoidingView 
        style={{ flex: 1, backgroundColor: theme.color1?.val }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
    <ScrollView contentContainerStyle={{flexGrow:1, padding:10}}
    backgroundColor={theme.color1?.val} flex={1}
    style={{ maxHeight: '100%', flex: 1 }}
    >
      {/* <Text>{postId} 상세페이지</Text> */}
      <YStack>
      {/* 작성자 영역 */}
      <YStack>
        <XStack>
          <Image source={require('@/assets/images/Chill_guy.jpg')}
            width={50} height={50} borderRadius={10}
          />
          <YStack marginLeft={5}>
          <Text>{postDetail?.userId}</Text>
          <Text>{postDetail?.createdAt ? format(postDetail.createdAt, 'yyyy.MM.dd'): ''}</Text>
          </YStack>
        </XStack>
      </YStack>

      <YStack>
        <H6>{postDetail?.title}</H6>
        <Text>{postDetail?.content}</Text>
      </YStack>
      <Group orientation="horizontal" width={400}>
        <Group.Item>
          <Button>First</Button>
        </Group.Item>
        <Group.Item>
          <Button>Second</Button>
        </Group.Item>
        <Group.Item>
          <Button>Third</Button>
        </Group.Item>
        </Group>
      <YStack>

      </YStack>
      {/* 글 내용 영역 */}

      {/* 댓글 영역 */}

      </YStack>
    </ScrollView>

    </TouchableWithoutFeedback>

    </KeyboardAvoidingView>
  );
}


