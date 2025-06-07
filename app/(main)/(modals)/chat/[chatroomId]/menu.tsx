import { CustomHeader } from "@/components/CustomHeader"
import { getChatroomSubscribeUser, getChatSubscribeUser } from "@/firebase/chat";
import { X } from "@tamagui/lucide-icons"
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, H6, Text, useTheme, XStack, YStack } from "tamagui";

export default function ChatMenu () {
	const router = useRouter();
	const theme =useTheme();
	const {chatroomId} = useLocalSearchParams<{chatroomId: string}>();
	const [enteredUsers, setEnteredUsers] = useState<any[]>([]);

	console.log("chatroomId", chatroomId);
			
	useEffect(()=> {
		const fetchUsers = async()=> {
			const users = await getChatSubscribeUser(chatroomId);
			console.log("대화상대 : ", users);
			setEnteredUsers(users);
		}
		fetchUsers();
	}, [chatroomId]);

	useEffect( ()=> {
		const fetchChatroomUsers = async() => {
			const users = await getChatroomSubscribeUser(chatroomId);
		}
		fetchChatroomUsers();
	}, [chatroomId]);

	return (
		
		<SafeAreaView style={{backgroundColor: theme.color2.val, flex:1}}>
			<CustomHeader showBackButton={true}>
				
			</CustomHeader>
			
			<ScrollView style={{flex:1, padding: 10}}>
				<YStack style={{flex: 1, justifyContent:"center", alignItems:'center', marginBottom:12}}>
					<H6>채팅방 제목</H6>
					<Image style={{width:100, height:100, borderRadius: 10}} source={require('@/assets/images/Chill_guy.jpg')}/>
				</YStack>
				<YStack style={{backgroundColor: theme.color4.val, padding: 10, borderRadius:10}}>
					<View style={{marginBottom: 8}}>
						<Text fontSize={15}>대화대상</Text>
					</View>

					{enteredUsers.map((user) => (
						<XStack key={user.uid} style={{alignItems:'center', marginBottom: 3}}>
							<Avatar>
								<Avatar.Image src={user.photoURL} style={{width:40, height:40, borderRadius: 10}}/>
							</Avatar>
							<Text fontSize={16}>{user.email}</Text>
						</XStack>
					))}

					
				</YStack>
				
				<View style={{marginTop: 5, marginBottom: 5}}></View>

				<YStack style={{backgroundColor: theme.color4.val, padding: 10, borderRadius:10}}>
					<TouchableOpacity >
						<Text color={'red'}>채팅방 나가기</Text>
					</TouchableOpacity>
				</YStack>

				
			</ScrollView>
			
		</SafeAreaView>
	)
}