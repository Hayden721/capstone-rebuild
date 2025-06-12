import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, styled, View, 
  useTheme, H6} from 'tamagui';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatroomAddButton from '@/components/ChatroomAddButton';
import { getChatroomList } from '@/firebase/firestore';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { checkChatroomSubscribeUser } from '@/firebase/chat';
import { Image } from 'expo-image';

export default function ChatList() {
const theme = useTheme();
const [chatroom, setChatroom] = useState<{id: string, title: string, explain: string, imageURL: string}[]>([]); // 채팅방 리스트 데이터
const router = useRouter();
const {user} = useAuth();
useFocusEffect(
  useCallback(() => {
    const fetchChatroomData = async () => {
      const data = await getChatroomList();
      setChatroom(data);
      console.log("채팅방 리스트 : ", data);
    }
    fetchChatroomData();
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

  //if(true) {채팅방으로 이동} else preview로 이동
}


  return (
    <SafeAreaView style={{ flex: 1, padding: 10, backgroundColor: theme.color1.val}}>
      <YStack>
        <Text style={{padding:5}} fontSize={'$6'} fontWeight={'900'}>채팅</Text>
      </YStack>

      <FlatList
        data={chatroom}
        style={{flex: 1}}
        keyExtractor={(item) => item.id}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleChatroomAccess(item)}>
            <Card p="$4" m="$2" borderRadius="$4" backgroundColor="$background">
              <XStack style={{justifyContent:'space-between'}}>
                <YStack>
                  <H6>{item.title}</H6>
                  <Paragraph>{item.explain}</Paragraph>
                </YStack>
                <Image source={{uri: item.imageURL}} style={{width:60, height:60, borderRadius:10}}/>
              </XStack>
            </Card>
          </TouchableOpacity>
      )}
      />

      <ChatroomAddButton/>
    </SafeAreaView>
  );
}