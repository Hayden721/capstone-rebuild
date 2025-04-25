import React, {useCallback, useEffect, useState} from 'react';
import { StyleSheet, FlatList, TouchableOpacity, Pressable, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, styled, View, 
  useTheme, Spinner} from 'tamagui';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import FixedAddButton from '@/components/FixedAddButton';
import { fetchPosts, resetPagination } from '@/firebase/firestore';

type postProps = {
  id: string;
  title: string;
  content: string;
  imageUrls: string;
}

// '/'에 해당하는 파일
export default function MajorDetail() {
const theme = useTheme();
const router = useRouter();
const { major } = useLocalSearchParams(); // "com", "elec"
const [postList, setPostList] = useState<postProps[]>([]); // 게시물 데이터
const majorString = major as string;
const [refreshing, setRefreshing] = useState(false); // 게시글 새로고침
const [refreshLoad, setRefreshLoad] = useState(false); // 새로고침 상태
const [loadingMore, setLoadingMore] = useState(false); // 무한 스크롤 추가 데이터 로딩 상태
const [hasMore, setHasMore] = useState(true); //

// 새로고침 핸들러 
const handleRefresh = async() => {
  setRefreshing(true); // 새로고침 실행 
  resetPagination(); // 페이지 리셋
  const freshPosts = await fetchPosts(majorString, true); // 새로운 게시글 조회
  setPostList(freshPosts); // postList 데이터 새로고침
  setHasMore(freshPosts.length >= 10); // 불러올 게시물이 10개보다 많거나 같을 때 true
  setRefreshing(false); // 새로고침 종료
}

const handleLoadMore = async () => {
  if(loadingMore || !hasMore || postList.length < 10) return; // 추가 데이터 로딩 상태가 false이고 hasMore이 false일 때 종료
  setLoadingMore(true);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const morePosts = await fetchPosts(majorString);
  if(morePosts.length < 10) setHasMore(false);
  setPostList(prev => [...prev, ...morePosts]);
  setLoadingMore(false);
}

// 게시글 리스트 조회
// useEffect(()=> {
//   const loadInitialPosts = async () => {
//     setRefreshLoad(true);
//     await handleRefresh();
//     setRefreshLoad(false);
//   };

//   loadInitialPosts();
// }, [majorString]);
useFocusEffect(
  useCallback(() => {
    const loadNewPosts = async() => {
      setRefreshLoad(true);
      await handleRefresh();
      setRefreshLoad(false);
    }
    loadNewPosts();
  }, [majorString])
)


  return (
    <YStack flex={1} backgroundColor={theme.color1?.val}>

      {refreshLoad ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
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
          <TouchableOpacity onPress={() => router.push(`/major/${major}/${item.id}`)}>
            <View padding={10} borderColor="beige" flexDirection='row' justifyContent='space-between'>
              <View>
                <Text fontSize={19}>{item.title}</Text>
                <Text fontSize={16}>{item.content}</Text>
              </View>              
              <Image source={{ uri: item.imageUrls }} style={{width : 100, height : 100, borderRadius:10}}/>
            </View>
          </TouchableOpacity>
          </View>
        )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          ListFooterComponent={loadingMore ? <Spinner size="large" color={theme.accent1?.val}/> : null}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.accent1?.val}/>}
        />
      )}

        
      
      {/* TODO: 고정된 게시글 추가 버튼 */}
      <FixedAddButton/>
    </YStack>  
  );
}


