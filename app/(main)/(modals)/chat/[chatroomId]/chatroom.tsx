import { CustomHeader } from "@/components/CustomHeader";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme } from "tamagui";
import { sendMessage, subscribeToMessages } from "@/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { GiftedChat, IMessage } from "react-native-gifted-chat";


export default function ChatRoom() {
	const theme = useTheme();
	const {chatroomId} = useLocalSearchParams<{chatroomId: string}>();
	const [messages, setMessages] = useState<IMessage[]>([]); // 채팅 데이터
	const roomId = chatroomId as string;
	const {user} = useAuth();
	
	// 실시간 채팅 메시지 조회
	useEffect(() => {
		const unsubscribe = subscribeToMessages(roomId, (message) => {
			setMessages(message); //callback
		});
		return () => unsubscribe();
	}, [chatroomId]);

  const handleSendMessage = useCallback((messages: IMessage[] = []) => {
		setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages)
    );

    messages.forEach(async (message) => {
			try {
				await sendMessage({
					chatroomId: roomId,
					message,
				})
			} catch (e) {
				console.error("sendMessage error : ", e);
			}
			
		})
		

  }, [roomId])


	return (
		<SafeAreaView style={{flex:1, backgroundColor: theme.color1.val}}>
			<CustomHeader showBackButton={true}>
			</CustomHeader>

			<GiftedChat
				messages={messages}
				onSend={messages => handleSendMessage(messages)}
				user={{_id: user?.uid ?? '', name: user?.email ?? undefined, avatar: user?.photoURL ?? undefined}}
				renderUsernameOnMessage={true}
				alignTop={false}
				showUserAvatar={false}
				
			/>
			
			
		</SafeAreaView>	
	)
}