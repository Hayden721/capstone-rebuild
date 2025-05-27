import { addUserToChatroom } from "@/firebase/chat";
import { useAuth } from "@/hooks/useAuth";
import BottomSheet from "@gorhom/bottom-sheet";
import { X } from "@tamagui/lucide-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useRef } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, useTheme, YStack } from "tamagui";


export default function ChatPreview() {
	const {chatroomId} = useLocalSearchParams();
	const router = useRouter();
	console.log("chatroomId : ", chatroomId);
	const chatroom = chatroomId as string;
	const theme = useTheme();
  const sheetRef = useRef<BottomSheet>(null);
  const {user} = useAuth();
	// ()=> router.replace({
	// 			pathname: "/(main)/(modals)/chat/[chatroomId]/chatroom",
	// 			params: {chatroomId: chatroomId as string}
	// 		})
	console.log(user)
	//채팅방 입장 여부 확인
	const chatroomEnterCheck = () => {
		Alert.alert(
			"채팅방 입장", // alert 제목
			"채팅방에 입장하시겠습니까?", // alert 본문
			[
				{
					text: "취소",
					style: 'cancel',
					onPress: () => {console.log("cancle")}
				},
				{
					text: "입장",
					style: 'default',
					onPress: async () => {
						if(user?.uid && user.email){

							try{
								await addUserToChatroom({chatroomId: chatroom, userUid:user?.uid, userEmail: user?.email});
								router.replace({
									pathname: "/(main)/(modals)/chat/[chatroomId]/chatroom",
									params: {chatroomId: chatroomId as string}
								})
							} catch(e) {
  							console.error("입장 처리 중 오류 : ", e);
              	Alert.alert("입장 실패", "채팅방 입장 중 오류가 발생했습니다.");
							}
							
						}
					}
					
				}
			],
			{cancelable: true}
		)
	}


  
	return (
		<SafeAreaView style={{flex:1, backgroundColor:theme.color1.val, padding: 10}}>
			<View>
				<TouchableOpacity onPress={() => router.back()}>
					<X size={'$2'}/>
				</TouchableOpacity>
			</View>
			<YStack>
			<Button onPress={chatroomEnterCheck} theme={'accent'}>채팅방 입장</Button>
			</YStack>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			

    </View>

		</SafeAreaView>
	)
} 