import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, styled, View, 
  useTheme, H6,
	Spinner} from 'tamagui';
import { useCallback, useEffect, useState } from 'react';

import ChatroomAddButton from '@/components/ChatroomAddButton';
import { getChatroomList } from '@/firebase/firestore';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { checkChatroomSubscribeUser, getChatroomInfiniteScroll } from '@/firebase/chat';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getChatroomProps } from '@/type/chatType';

export default function ChatList() {
const theme = useTheme();
const router = useRouter();
const {user} = useAuth();
const [chatroom, setChatroom] = useState<getChatroomProps[]>([]); // 채팅방 리스트 데이터
const [lastDoc, setLastDoc] = useState(null); // 마지막 문서 상태 값
const [loading, setLoading] = useState(false); // 
const [refreshing, setRefreshing] = useState(false); // 새로고침 상태
const [hasMore, setHasMore] = useState(true); // 문서가 더 존재 하는지에 대한 상태 값

const loadChatroomData = async () => {
		const {rooms, lastDoc} = await getChatroomInfiniteScroll(10);
		console.log("채팅방 리스트 : ", rooms);
		console.log("마지막 문서 : ", lastDoc);
		setChatroom(rooms);
		setLastDoc(lastDoc);
		setHasMore(rooms.length > 0)
		setRefreshing(false);
	};

	// 추가 데이털 로드 (스크롤 끝에서 동작)
const loadMoreChatrooms = async () => {
	if(loading || !hasMore) return;
	setLoading(true); // 로딩 상태 true로 변경
	// 변수 이름 변경(aliasing)
	const {rooms: newRooms, lastDoc: newLastDoc} = await getChatroomInfiniteScroll(10, lastDoc);

	if(newRooms.length === 0) setHasMore(false);
	// 기존에 조회했던 채팅방 리스트에 newPosts를 이어 붙이기
	setChatroom(prev => [...prev, ...newRooms])
	setLastDoc(newLastDoc);
	setLoading(false);

}

useFocusEffect(
  useCallback(() => {
    loadChatroomData();
  }, [])
)



const handleChatroomAccess = async (item: any) => {
  if(!user?.uid) return;
  // 1. firestore /chatrooms/{chatroomId}/users에 내 email과 같은 아이디 있으면 true 반환
  const checkUser = await checkChatroomSubscribeUser({chatroomId: item.id, userUid: user.uid})
  if(checkUser) {
    router.push(`/(main)/(modals)/chat/${item.id}/chatroom`)
  } else {
    router.push(`/(main)/(modals)/chat/${item.id}/preview`)
  }
}


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.color1.val}} edges={['top']}>
      <View>
        <Text style={{padding:5, marginLeft:5}} fontSize={'$6'} fontWeight={'900'}>채팅</Text>
      </View>

			<FlatList
				data={chatroom}
				keyExtractor={item => item.chatroomId}
				renderItem={({item})=> (
					<TouchableOpacity onPress={() => handleChatroomAccess(item)}>
            <Card p="$4" m="$2" borderRadius="$4" style={{backgroundColor: theme.color3.val}}>
              <XStack style={{justifyContent:'space-between'}}>
                <YStack>
                  <H6>{item.title}</H6>
                  <Paragraph>{item.explain}</Paragraph>
                </YStack>
                <Image source={{uri: item.imageURL}} style={{width:65, height:65, borderRadius:10}}/>
              </XStack>
            </Card>
          </TouchableOpacity>
				)}
				onEndReached={loadMoreChatrooms}
				onEndReachedThreshold={0.1}
				ListFooterComponent={loading ? <Spinner size="large" color={theme.accent1?.val}/> : null}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadChatroomData} tintColor={theme.accent12.val}/>}
				
			/>
      <ChatroomAddButton/>
    </SafeAreaView>
  );
}