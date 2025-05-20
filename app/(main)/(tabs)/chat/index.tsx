import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  YStack, XStack, Text, Card, Button, 
  Separator, Label, RadioGroup, Paragraph, 
  Theme, AnimatePresence, Image, styled, View, 
  useTheme, H6} from 'tamagui';
import { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ChatroomAddButton from '@/components/ChatroomAddButton';
import { getChatroomList } from '@/firebase/firestore';
import { useFocusEffect, useRouter } from 'expo-router';

export default function ChatList() {
const theme = useTheme();
const [chatroom, setChatroom] = useState([]); // 채팅방 리스트 데이터
const router = useRouter();

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
          <TouchableOpacity onPress={()=>router.push(`/(main)/(modals)/chat/${item.id}/preview`)}>
            <Card p="$4" m="$2" borderRadius="$4" backgroundColor="$background">
              <YStack>
                <H6>{item.title}</H6>
                <Paragraph>{item.explain}</Paragraph>
              </YStack>
            </Card>
          </TouchableOpacity>
      )}
      />

      <ChatroomAddButton/>
    </SafeAreaView>
  );
}