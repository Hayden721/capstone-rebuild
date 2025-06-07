import React, {useCallback, useEffect, useState} from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Pressable, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, styled, View, 
  useTheme, Spinner} from 'tamagui';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import PostAddButton from '@/components/PostAddButton';
import { fetchPosts, resetPagination } from '@/firebase/posts';
import { CustomHeader } from '@/components/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import majorTitleMap from '@/constants/majorTitleMap';

type postProps = {
  id: string; // 게시글 id
  title: string; // 제목
  content: string; // 내용
  imageURLs: string; // 이미지 URL
  category: string; // 카테고리
  userUID: string; // 유저 uid
  email: string | null; // 이메일
}

// 게시판 리스트
export default function PostsDetail() {
const theme = useTheme();
const router = useRouter();
const { category } = useLocalSearchParams<{category: string}>(); // "com", "elec"등 카테고리
const [postList, setPostList] = useState<postProps[]>([]); // 게시물 데이터
const [refreshing, setRefreshing] = useState(false); // 게시글 새로고침
const [refreshLoad, setRefreshLoad] = useState(false); // 새로고침 상태
const [loadingMore, setLoadingMore] = useState(false); // 무한 스크롤 추가 데이터 로딩 상태
const [hasMore, setHasMore] = useState(true); // 추가 데이터 로딩

useEffect(() => {
  console.log("현재 category:", category);
}, [category]);

// 새로고침 핸들러 
const handleRefresh = async() => {
  setRefreshing(true); // 새로고침 실행 
  resetPagination(); // 페이지 리셋
  const freshPosts = await fetchPosts(category, true); // 새로운 게시글 조회

  setPostList(freshPosts); // postList 데이터 새로고침
  setHasMore(freshPosts.length >= 10); // 불러올 게시물이 10개보다 많거나 같을 때 true
  setRefreshing(false); // 새로고침 종료
}

const handleLoadMore = async () => {
  if(loadingMore || !hasMore || postList.length < 10) return; // 추가 데이터 로딩 상태가 false이고 hasMore이 false일 때 종료
  setLoadingMore(true);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const morePosts = await fetchPosts(category);
  if(morePosts.length < 10) setHasMore(false);
  setPostList(prev => [...prev, ...morePosts]);
  setLoadingMore(false);
}

// 게시글 리스트 조회
useFocusEffect(
  useCallback(() => {
    const loadNewPosts = async() => {
      setRefreshLoad(true);
      await handleRefresh();
      setRefreshLoad(false);
    }
    loadNewPosts();
  }, [category])
)

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.color1.val}}>
      <CustomHeader showBackButton={true} title={majorTitleMap[category]}>

      </CustomHeader>

      {refreshLoad ? (
        <YStack style={{flex:1, justifyContent:'center', alignItems: 'center'}} >
          <ActivityIndicator size="large" color={theme.color10?.val || 'gray'} />
        </YStack>
      ):(
        <FlatList
          data={postList}
          keyExtractor={(item)=> item.id}
          contentContainerStyle={{flexGrow: 1, minHeight: '100%'}}
          alwaysBounceVertical={true}
          renderItem={({item}) => (
            <View borderBottomWidth={0.5} borderColor={"#999"} > 
              <TouchableOpacity onPress={() => router.push(`./${category}/${item.id}`)}>
                <View style={{padding:10, borderColor:'beige', flexDirection:'row', justifyContent:'space-between'}}>
                  <View>
                    <Text fontSize={19}>{item.title}</Text>
                    <Text fontSize={16}>{item.content}</Text>
                  </View>              
                  <Image source={{ uri: item.imageURLs }} style={{width : 100, height : 100, borderRadius:10}}/>
                </View>
              </TouchableOpacity>
            </View>
        )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={loadingMore ? <Spinner size="large" color={theme.accent1?.val}/> : null}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.accent12?.val}/>}
        />
      )}
      {/* TODO: 고정된 게시글 추가 버튼 */}
      <PostAddButton/>
    </SafeAreaView>  
  );
}


