import BackScreenButton from '@/components/BackScreenButton';
import Divider from '@/components/Divider';
import { PostDropDownMenu } from '@/components/PostDropDownMenu';
import { getDetailPost, addComment, getComments } from '@/firebase/firestore';
import { useAuth } from '@/hooks/useAuth';
import { getCommentProps, postProps } from '@/type/firebaseType';
import { Bookmark, MessageCircle, Send, ThumbsUp, X } from '@tamagui/lucide-icons';
import { format } from 'date-fns';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView,Platform, TouchableOpacity, TouchableWithoutFeedback, 
  Text, View, ScrollView, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  H6, Image, Input, useTheme, XStack, YStack
} from 'tamagui';

export default function detail() {
const theme = useTheme();
const router = useRouter();
const { major, postId } = useLocalSearchParams<{major: string, postId: string}>();
const [postDetail, setPostDetail] = useState<postProps | null>(null); //게시글 상세 정보
const [comment, setComment] = useState<string>(''); // 
const storageAuth = useAuth(); // asyncStroage에 저장된 로그인 정보
const userId = storageAuth.user?.email;
const [comments, setComments] = useState<getCommentProps[]>([]); // 댓글 배열
const [commentsLoading, setCommentsLoading] = useState(true);

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


// 댓글 달기
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
  <SafeAreaView style={{ flex: 1, backgroundColor: theme.color1?.val }}>
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.color1?.val }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={10}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          {/* 커스텀 헤더 (고정) */}
          <XStack height={50} justifyContent='space-between' alignItems='center' backgroundColor={theme.accent1?.val}>
            <BackScreenButton/>
            <PostDropDownMenu major={major} postId= {postId}/>
          </XStack>

          <FlatList // 댓글 목록 (스크롤 가능)
            data={comments}
            contentContainerStyle={{padding: 10}}
            renderItem={({ item }) => (
              <View style={{ paddingVertical: 10, backgroundColor: theme.accent1?.val }}>
                <Text>{item.content}</Text>
                <Text>{item.createdAt instanceof Date
                  ? format(item.createdAt, 'yyyy.MM.dd HH:mm')
                  : '날짜 없음'}</Text>
              </View>
            )}
            keyExtractor={(item) => item.commentId}
            style={{ flex: 1 }} // FlatList가 남은 공간을 차지하도록 설정
            ListHeaderComponent={() => ( // 게시글 상세 정보를 FlatList의 헤더로 이동
              <YStack padding={10}>
                {/* 작성자 영역 */}
                <YStack>
                  <XStack>
                    <Image source={require('@/assets/images/Chill_guy.jpg')}
                      width={50} height={50} borderRadius={10}/>
                    <YStack marginLeft={5}>
                      <Text fontSize={16}>{postDetail?.userId}</Text>
                      <Text>{postDetail?.createdAt ? format(postDetail.createdAt, 'yyyy.MM.dd hh:MM'): ''}</Text>
                    </YStack>
                  </XStack>
                </YStack>

                {/* 글 내용 */}
                <YStack marginTop={8} >
                  <H6 fontWeight={500}>{postDetail?.title}</H6>
                  <Text fontSize={17} fontWeight={400}>{postDetail?.content}</Text>
                </YStack>

                {/* 버튼 모음 */}
                <YStack>
                  <XStack justifyContent='flex-end'>
                    <TouchableOpacity style={{marginRight: 8, display:"flex", flexDirection:"row", alignItems:"center"}} >
                      <ThumbsUp marginRight={3} />
                      <Text fontSize={19}>1</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Bookmark/>
                    </TouchableOpacity>
                  </XStack>
                </YStack>
                <Divider/>
              </YStack>
            )}
          />

          {/* 댓글 입력창 (고정) */}
          <View style={{ paddingLeft:10, paddingRight:10, backgroundColor: theme.color1?.val }}>
            <XStack alignItems="center">
              <Input
                value={comment}
                onChangeText={setComment}
                placeholder={"댓글을 입력하세요"}
                marginRight={10}
                multiline
                style={{ flex:1, fontSize: 15, backgroundColor:theme.color2?.val, maxHeight:90,
                  textAlignVertical: 'top',
                  paddingVertical: 10,}}
                />
              <TouchableOpacity
                onPress={handleSubmitComment}>
                  <Send/>
              </TouchableOpacity>
            </XStack>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  </SafeAreaView>
  );
}


