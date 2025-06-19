import CustomAlert from "@/components/CutsomAlert";
import { addUserToChatroom, enterUserToChatroom } from "@/firebase/chat";
import { getChatroomInfo } from "@/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { getChatroomProps } from "@/type/chatType";
import { X } from "@tamagui/lucide-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, useTheme, YStack } from "tamagui";

export default function ChatPreview() {
	const {chatroomId} = useLocalSearchParams<{chatroomId: string}>();
	const router = useRouter();
	console.log("chatroomId : ", chatroomId);
	const chatroom = chatroomId as string;
	const theme = useTheme();
  const {user} = useAuth();
	const [chatroomInfo, setChatroomInfo] = useState<getChatroomProps|null>(null);
	const [enterAlert, setEnterAlert] = useState(false);

	// 채팅방 정보 	
	useEffect(() => {
		const chatroomInfo = async () => {
			//chatrooms/{chatroomId}에서 admin, title, explain, users(length)
			const roomInfo = await getChatroomInfo(chatroomId);
			if(roomInfo) {
				setChatroomInfo(roomInfo);
				console.log("chatroomInfo", roomInfo);
			} else {
				console.warn("chatroomInfo null");
			}
			
		}
		chatroomInfo();
	}, [])
	// 버튼을 클릭하면 modal이 켜짐 
		//채팅방 입장 여부 확인
	const handleChatroomEnter = async () => {
		if(user?.uid && user.email){
			try{
				// 1. 채팅방 문서에 users에 userUID를 배열에 추가하는 함수
				await enterUserToChatroom(chatroom, user.uid);
				// 2. 유저 정보를 저장
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

	return (
		<SafeAreaView style={{flex:1, backgroundColor:theme.color1.val, paddingLeft:10, paddingRight:10}}>
			<View>
				<TouchableOpacity onPress={() => router.back()}>
					<X size={'$2'}/>
				</TouchableOpacity>
			</View>

			<View style={{flex: 1, marginTop:30, alignItems: "center"}}>
				<Image style={{width:200, height:200, borderRadius:10}} source={{uri: chatroomInfo?.imageURL}}/>
				<Text style={{fontSize: 25, fontWeight:'700'}}>{chatroomInfo?.title}</Text>
				<Text style={{fontSize: 15}}>{chatroomInfo?.explain}</Text>
				<Text style={{fontSize: 15}}>채팅 인원 : {chatroomInfo?.users.length}</Text>
    	</View>

			<YStack style={{marginBottom: 15}}>
				<Button onPress={()=>setEnterAlert(true)} theme={'accent'}>채팅방 입장</Button>
			</YStack>
			
			<CustomAlert visible={enterAlert} 
				title="채팅방 입장" 
				message="채팅방 입장하시겠습니까?" 
				confirmText="입장" 
				confirmColor={theme.color12.val}
				cancelText="취소"
				cancelColor={"red"}
				onConfirm={handleChatroomEnter}
				onCancel={() => {
					setEnterAlert(false);              
			}}/>

		</SafeAreaView>
	)
} 