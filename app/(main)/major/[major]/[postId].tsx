
import { CustomHeader } from '@/components/CustomHeader';
import Divider from '@/components/Divider';
import { PostDropDownMenu } from '@/components/PostDropDownMenu';
import { getDetailPost, addComment, getComments } from '@/firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { getCommentProps, postProps } from '@/type/firebaseType';
import { Bookmark, MessageCircle, Send, ThumbsUp, X } from '@tamagui/lucide-icons';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView,Platform, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  H6, Image, Input, useTheme, XStack, YStack, Text
} from 'tamagui';

export default function detail() {
const theme = useTheme();
const { major, postId } = useLocalSearchParams<{major: string, postId: string}>(); // 현재 전공과 게시글 아이디 값
const [postDetail, setPostDetail] = useState<postProps | null>(null); //게시글 상세 정보
const [comment, setComment] = useState<string>(''); // 전송할 댓글 데이터  
const storageAuth = useAuth(); // asyncStroage에 저장된 로그인 정보
const userId = storageAuth.user?.email;
const [comments, setComments] = useState<getCommentProps[]>([]); // 댓글 배열
const [commentsLoading, setCommentsLoading] = useState(true); // 댓글 조회 상태 (기본값 true)

// 게시글 상세 조회
useEffect(() => {
  const fetchPost = async () => {
    const post = await getDetailPost(major, postId);
    setPostDetail(post);
    console.log("가져온 게시물 데이터 : ", post);
  }
  fetchPost();
}, [major, postId]);

// 댓글 조회
useEffect(() => {
  fetchComments();
}, [major, postId]);

// 댓글 조회
const fetchComments = async () => {
  try{
    const fetched = await getComments({major, postId});
    setComments(fetched);
  } catch (error) {
    console.log("comment get error : ", error);
  } finally {
    setCommentsLoading(false);
  }
}

// 댓글 달기 함수
const handleSubmitComment = () => {
  if(!userId) {
    console.warn("로그인을 해야 댓글 작성이 가능합니다.");
    return  
  }
  if(!comment.trim()) {
    console.log("댓글을 입력하세요");
    return
  }
  addComment({major, postId, comment, userId});
  console.log("댓글 : ", comment);
  setComment('');
  fetchComments();
}

return (
  (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    keyboardVerticalOffset={Platform.OS === 'ios'? -30 : 0}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <CustomHeader showBackButton={true}>
              <PostDropDownMenu major={major} postId={postId} />
            </CustomHeader>

            <FlatList
              data={comments}
              keyExtractor={(item) => item.commentId}
              contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
              keyboardShouldPersistTaps="handled"
              ListHeaderComponent={
                <>
                  <XStack style={{ backgroundColor: theme.accent11.val }}>
                    <Image
                      source={require('@/assets/images/Chill_guy.jpg')}
                      width={55}
                      height={55}
                      borderRadius={10}
                    />
                    <View style={{ marginLeft: 7 }}>
                      <Text style={{ fontSize: 17 }}>{postDetail?.userId}</Text>
                      <Text style={{ fontSize: 14 }}>
                        {postDetail?.createdAt
                          ? format(postDetail.createdAt, 'yyyy.MM.dd HH:mm')
                          : ''}
                      </Text>
                    </View>
                  </XStack>

                  <YStack style={{ marginTop: 8 }}>
                    <H6 fontWeight={500}>{postDetail?.title}</H6>
                    <Text fontSize={17} fontWeight={400}>
                      {postDetail?.content}
                    </Text>
                  </YStack>

                  <XStack style={{ justifyContent: 'flex-end', marginVertical: 10 }}>
                    <TouchableOpacity
                      style={{ marginRight: 8, flexDirection: 'row', alignItems: 'center' }}
                    >
                      <ThumbsUp style={{ marginRight: 3 }} />
                      <Text fontSize={19}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Bookmark />
                    </TouchableOpacity>
                  </XStack>

                  <Divider />
                </>
              }
              renderItem={({ item }) => (
                <YStack
                  style={{
                    padding: 10,
                    backgroundColor: theme.accent1.val,
                    borderRadius: 10,
                    marginTop: 8,
                  }}
                >
                  <Text>{item.content}</Text>
                  <Text fontSize={12} color={theme.gray10?.val}>
                    {item.createdAt instanceof Date
                      ? format(item.createdAt, 'yyyy.MM.dd HH:mm')
                      : '날짜 없음'}
                  </Text>
                </YStack>
              )}
            />
            <XStack
              style={{
                alignItems: 'center',
                width: '100%',
                padding: 10,
                backgroundColor: theme.color1.val,
              }}
            >
              <Input
                value={comment}
                onChangeText={setComment}
                placeholder="댓글을 입력하세요"
                multiline
                style={{
                  flex: 1,
                  fontSize: 15,
                  backgroundColor: theme.color2?.val,
                  height: 43,
                  paddingVertical: 10,
                  textAlignVertical: 'center',
                  marginRight: 10,
                }}
              />
              <TouchableOpacity onPress={handleSubmitComment}>
                <Send />
              </TouchableOpacity>
            </XStack>
          </>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
);
  
}


