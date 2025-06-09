
import { CustomHeader } from '@/components/CustomHeader';
import Divider from '@/components/Divider';
import { PostDropDownMenu } from '@/components/PostDropDownMenu';
import { addComment, getComments, getLikePostCount, getlikePostCount, isPostLiked, likePost, unlikePost } from '@/firebase/posts';
import { getDetailPost } from '@/firebase/posts';
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
  H6, Input, useTheme, XStack, YStack, Text
} from 'tamagui';
import Lightbox from "react-native-lightbox-v2"; // 이미지 확대 
import { Image } from 'expo-image';

// 게시글 상세 조회
export default function detail() {
const theme = useTheme();
const { category, postId } = useLocalSearchParams<{category: string, postId: string}>(); // 현재 전공과 게시글 아이디 값
const [postDetail, setPostDetail] = useState<postProps | null>(null); //게시글 상세 정보
const [comment, setComment] = useState<string>(''); // 전송할 댓글 데이터  
const {user} = useAuth(); // asyncStroage에 저장된 로그인 정보
const userUID = user?.uid as string;
const [comments, setComments] = useState<getCommentProps[]>([]); // 댓글 배열
const [commentsLoading, setCommentsLoading] = useState(true); // 댓글 조회 상태 (기본값 true)
const [isLiked, setIsLiked] = useState(false); // 좋아요를 했는지 확인
const [likeCount, setLikeCount] = useState<number>(0);

// 좋아요 반영
useEffect(()=> {
  const fetchLikeStatus = async () => {
    const liked = await isPostLiked(postId, userUID);
    const count = await getLikePostCount(postId);
    setIsLiked(liked);
    setLikeCount(count);
  }
  fetchLikeStatus();
}, [postId, userUID]);

// 상세 조회 데이터
useEffect(() => {
  const fetchPost = async () => {
    const post = await getDetailPost(postId);
    setPostDetail(post);
    console.log("가져온 게시물 데이터 : ", post);
  }
  fetchPost();
}, [category, postId]);

//댓글 조회
useEffect(() => {
  fetchComments();
}, [postId]);

// 댓글 조회
const fetchComments = async () => {
  try{
    const fetchComment = await getComments(postId);
    setComments(fetchComment);
  } catch (error) {
    console.error("comment get error : ", error);
  } finally {
    setCommentsLoading(false);
  }
}

// 댓글 달기 함수
const handleSubmitComment = () => {
  if(!user?.uid) {
    console.warn("로그인을 해야 댓글 작성이 가능합니다.");
    return  
  }
  if(!comment.trim()) {
    console.log("댓글을 입력하세요");
    return
  }
  addComment({postId:postId, comment:comment, userUID:user.uid});
  console.log("댓글 : ", comment);
  setComment('');
  fetchComments();
}

const handleLike = async () => {
  console.log("like click");
  if(isLiked) {
    await unlikePost(postId, userUID);
  } else {
    await likePost(postId, userUID);
  }
  const updateLiked = await isPostLiked(postId, userUID);
  const updateCount = await getLikePostCount(postId);
  setIsLiked(updateLiked);
  setLikeCount(updateCount);

}

return (
  (
    <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: theme.color1.val }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios'? -30 : 0}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <CustomHeader showBackButton={true}>
              <PostDropDownMenu category={category} postId={postId} postUserUID={postDetail?.userUID} userUID={user?.uid}/>
            </CustomHeader>

            <FlatList
              data={comments}
              keyExtractor={(item) => item.commentId}
              contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
              keyboardShouldPersistTaps="handled"
              // 상세 데이터 부분
              ListHeaderComponent={
                <>
                  <XStack style={{ backgroundColor: theme.color1.val }}>
                    <Image
                      source={{uri: postDetail?.photoURL}}
                      style={{width:55, height:55, borderRadius:10}}
                    />
                    <View style={{ marginLeft: 7 }}>
                      <Text style={{ fontSize: 17 }}>{postDetail?.email}</Text>
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
                      onPress={handleLike}
                      style={{ marginRight: 8, flexDirection: 'row', alignItems: 'center' }}
                    >
                      {isLiked 
                        ? <ThumbsUp style={{ marginRight: 3}} color={theme.accent1.val} fill={theme.accent1.val} /> 
                        : <ThumbsUp style={{ marginRight: 3}} fill={theme.color1.val}/>
                      }

                      <Text marginStart={3} fontSize={19}>{likeCount}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Bookmark />
                    </TouchableOpacity>
                  </XStack>

                  <Divider />
                </>
              }
              // 댓글 부분
              renderItem={({ item }) => (
                <YStack
                  style={{
                    padding: 10,
                    backgroundColor: theme.accent1.val,
                    borderRadius: 10,
                    marginTop: 8,
                  }}
                >
                  <XStack>
                    <Text fontSize={10} color={theme.gray10?.val}>
                        {item.createdAt instanceof Date
                        ? format(item.createdAt, 'yyyy.MM.dd HH:mm')
                        : '날짜 없음'}
                      </Text>
                    <YStack>                  
                      <Text fontSize={15}>{item.content}</Text>
                      
                      </YStack>
                  </XStack>

                    
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
                  height: 50,
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


