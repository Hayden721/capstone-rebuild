
import { CustomHeader } from '@/components/CustomHeader';
import Divider from '@/components/Divider';
import { PostDropDownMenu } from '@/components/PostDropDownMenu';
import { addComment, deleteComment, getComments, getLikePostCount, isPostLiked, likePost, unlikePost } from '@/firebase/posts';
import { getDetailPost } from '@/firebase/posts';
import { useAuth } from '@/hooks/useAuth';
import { getCommentProps, getPostProps } from '@/type/postType';
import { AppWindowMac, Bookmark, MessageCircle, Send, ThumbsUp, X } from '@tamagui/lucide-icons';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Keyboard, KeyboardAvoidingView,Platform, TouchableOpacity, TouchableWithoutFeedback, View, ScrollView, FlatList,
  Alert,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  H6, Input, useTheme, XStack, YStack, Text,
  AlertDialog,
  Button
} from 'tamagui';
import ImageView from "react-native-image-viewing";
import { Image } from 'expo-image';
import CustomAlert from '@/components/CutsomAlert';
// 게시글 상세 조회
export default function detail() {
const theme = useTheme();
const { category, postId } = useLocalSearchParams<{category: string, postId: string}>(); // 현재 전공과 게시글 아이디 값
const [postDetail, setPostDetail] = useState<getPostProps>(); //게시글 상세 정보
const [comment, setComment] = useState<string>(''); // 전송할 댓글 데이터  
const {user} = useAuth(); // asyncStroage에 저장된 로그인 정보
const userUID = user?.uid as string;
const [comments, setComments] = useState<getCommentProps[]>([]); // 댓글 map data
const [commentsLoading, setCommentsLoading] = useState(true); // 댓글 조회 상태 (기본값 true)
const [isLiked, setIsLiked] = useState(false); // 좋아요를 했는지 확인
const [likeCount, setLikeCount] = useState<number>(0);
const [commentDelAlert, setCommentDelAlert] = useState(false);
const [selectCommentId, setSelectCommentId] = useState<string|null>(null);
const [imageVisible, setImageVisible] = useState(false);
const [imageIndex, setImageIndex] = useState(0);
const [postImages, setPostImage] = useState<string[]>([]);
console.log("이미지 확인 : ", postImages);

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
    setPostImage(post.imageURLs);
    // console.log("가져온 이미지:", post.imageURLs);
    // console.log("가져온 게시물 데이터 : ", post);
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
    console.log("댓글 데이터 : ", fetchComment);
    setComments(fetchComment);
  } catch (error) {
    console.error("comment get error : ", error);
  } finally {
    setCommentsLoading(false);
  }
}

// 댓글 추가 
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

const handleCommentDeletebutton = (commentId: string) => {
  setSelectCommentId(commentId);
  setCommentDelAlert(true);
}

//댓글 삭제
const handleCommentDelete = async () => {
  console.log("선택한 댓글의 uid", selectCommentId);
  if(selectCommentId) {
    // 파이어베이스에서 댓글 삭제 
    await deleteComment(postId ,selectCommentId)
    // 삭제 후 서버에서 다시 댓글을 조회
    await fetchComments();
  }
  setSelectCommentId(null);
  setCommentDelAlert(false);
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
  
    <KeyboardAvoidingView
    style={{ flex: 1, backgroundColor: theme.color1.val }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={Platform.OS === 'ios'? -30 : 20}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          
          <>
            <CustomHeader showBackButton={true}>
              <PostDropDownMenu postId={postId} postUserUID={postDetail?.userUID} userUID={user?.uid} category={category}/>
            </CustomHeader>

            <FlatList
              data={comments}
              keyExtractor={(item) => item.commentId}
              contentContainerStyle={{ padding: 10, paddingBottom: 120 }}
              keyboardShouldPersistTaps="handled"
              // 상세 데이터 부분
              ListHeaderComponent={
                <YStack>
                  <XStack style={{ backgroundColor: theme.color1.val }}>
                    <Image
                      source={{uri: postDetail?.photoURL}}
                      style={{width:55, height:55, borderRadius:10}}
                    />
                    <View style={{ marginLeft: 7 }}>
                      <Text style={{ fontSize: 17, color:theme.color12.val }}>{postDetail?.email}</Text>
                      <Text style={{ fontSize: 14, color:theme.color12.val }}>
                        {postDetail?.createdAt
                          ? format(postDetail.createdAt, 'yyyy.MM.dd HH:mm')
                          : ''}
                      </Text>
                    </View>
                  </XStack>

                  <YStack style={{ marginTop: 8 }}>
                    <View style={{marginBottom: 8}}>
                      <H6 fontWeight={500} style={{color: theme.color12.val}}>{postDetail?.title}</H6>
                      <Text fontSize={17} fontWeight={400} style={{color: theme.color12.val}}>
                        {postDetail?.content}
                      </Text>
                    </View>
                    {postDetail?.imageURLs && postDetail?.imageURLs.length > 0 && (
                      <ScrollView horizontal>
                        {postImages.map((url, index)=> (
                          <TouchableOpacity 
                            style={{width:'auto', height: 100}}
                            key={index}
                            onPress={()=> {
                              setImageVisible(true);
                              setImageIndex(index)
                            }}
                          >
                            <Image source={{uri: url}} style={styles.postImages}/>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}

                  </YStack>

                  <XStack style={{ justifyContent: 'flex-end', marginVertical: 10 }}>
                    <TouchableOpacity
                      onPress={handleLike}
                      style={{ marginRight: 8, flexDirection: 'row', alignItems: 'center' }}
                    >
                      {isLiked 
                        ? <ThumbsUp style={{ marginRight: 3}} color="$accent1" fill={theme.accent1.val} /> 
                        : <ThumbsUp style={{ marginRight: 3}} fill={theme.color1.val}/>
                      }
                      <Text marginStart={3} fontSize={19} style={{color: theme.color12.val}}>{likeCount}</Text>
                    </TouchableOpacity>
                    
                  </XStack>
                  <Divider />
                </YStack>
              }
              
              renderItem={({ item }) => (
                <YStack
                  style={{
                    padding: 10,
                    backgroundColor: theme.color3.val,
                    borderRadius: 10,
                    marginTop: 8,
                  }}>
                  <XStack style={{marginBottom:4}}>
                    <Image
                      source={{uri:item.userPhotoURL}}
                      style={{width:33, height:33, borderRadius:10}}/>
                    <YStack style={{marginLeft:8, flex:1}}>
                      <Text>{item.email}</Text> 
                      <Text fontSize={10} color="$color12"> 
                        {item.createdAt instanceof Date
                        ? format(item.createdAt, 'yyyy.MM.dd HH:mm')
                        : '날짜 없음'}
                      </Text>  
                    </YStack>

                    {item.userUID === user?.uid &&
                    <TouchableOpacity onPress={() => handleCommentDeletebutton(item.commentId)}>
                      <X/>  
                    </TouchableOpacity>
                    }
                      
                  </XStack>
                  <Text fontSize={16}>{item.content}</Text>
                    
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
                placeholderTextColor={theme.color12.val}
                multiline
                style={{
                  flex: 1,
                  fontSize: 15,
                  backgroundColor: theme.color2?.val,
                  height: 50,
                  paddingTop: Platform.OS === 'ios' ? 10 : 10,
                  paddingBottom: Platform.OS === 'ios' ? 10 : 10,
                  marginRight: 10,
                  textAlignVertical: 'center', // 안드로이드만 적용됨
                  color: theme.color12.val
                }}
              />
              <TouchableOpacity onPress={handleSubmitComment}>
                <Send />
              </TouchableOpacity>
            </XStack>
                
            <ImageView
              images={postImages.map((url) => ({uri: url}))}
              imageIndex={imageIndex}
              visible={imageVisible}
              onRequestClose={()=> setImageVisible(false)}
              swipeToCloseEnabled={false}
              presentationStyle={'fullScreen'}
            />

            <CustomAlert visible={commentDelAlert} 
              title="댓글 삭제" 
              message="댓글을 삭제하시겠어요?" 
              confirmText="삭제" 
              confirmColor={"red"}
              cancelText="취소"
              cancelColor={theme.color12.val}
              onConfirm={handleCommentDelete}
              onCancel={() => {
                setCommentDelAlert(false);
                setSelectCommentId(null);
              }}/>
          </>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </KeyboardAvoidingView>
  
);
  
}

const styles = StyleSheet.create({
  postImage: {
    width:'auto',
    height: 500,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  postImages: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight:6
  },
})