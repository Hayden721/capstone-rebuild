	import { CustomHeader } from "@/components/CustomHeader";
	import { useLocalSearchParams } from "expo-router";
	import { useCallback, useEffect, useMemo, useRef, useState } from "react";
	import { KeyboardAvoidingView, Platform, View, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Pressable, StyleSheet, Dimensions } from "react-native";
	import { SafeAreaView } from "react-native-safe-area-context";
	import { Button, Text, useTheme, XStack, YStack } from "tamagui";
	import { sendMessage, subscribeToMessages } from "@/firebase/firestore";
	import { useAuth } from "@/hooks/useAuth";
	import { ActionsProps, Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";
	import { Camera, ImagePlus, Plus, Video, X } from "@tamagui/lucide-icons";
	import BottomSheet, { BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
	import { StatusBar } from "expo-status-bar";
import { ChatMenuButton } from "@/components/chat/chatMenuButton";

	export default function ChatRoom() {
		const theme = useTheme();
		const {chatroomId} = useLocalSearchParams<{chatroomId: string}>();
		const [messages, setMessages] = useState<IMessage[]>([]); // 채팅 데이터
		const roomId = chatroomId as string;
		const {user} = useAuth();
		// 바텀시트
		const bottomSheetRef = useRef<BottomSheet>(null);
		const snapPoints = useMemo(() => ['40%'],[]);
		const openBottomSheet = () => {
			console.log("바텀 시트 실행", bottomSheetRef.current);
			bottomSheetRef.current?.expand();
		};
		
		// 실시간 채팅 메시지 조회
		useEffect(() => {
			const unsubscribe = subscribeToMessages(roomId, (message) => {
				setMessages(message); //callback
			});
			return () => unsubscribe();
		}, [chatroomId]);

		// 배경 터치 시 BottomSheet 닫기
		const renderBackdrop = useCallback(
			(props) => (
				<BottomSheetBackdrop
					{...props}
					appearsOnIndex={0}
					disappearsOnIndex={-1}
					pressBehavior="close"
					style={{backgroundColor: 'transparent', opacity: 0}}
				/>
			),
			[]
		);

		const handleSheetCloseChanges = useCallback((index: number, position: number)=> {
			console.log('Sheet position:', position, 'index:', index);
			// index가 0이면 (20% 위치에 도달하면) 강제로 완전히 닫기
			if(index === 0) {
				console.log('Closing sheet');
				bottomSheetRef.current?.close();
			}
		},[]);

		//채팅 입력창 왼쪽 버튼
		const chatLeftButton = (props: ActionsProps) => {

			return (
				<TouchableOpacity onPress={() => {
					Keyboard.dismiss();  // 키보드 닫기
					openBottomSheet();   // 바텀시트 열기
				}}
					style={{justifyContent:'center', alignItems:'center',height:44, marginLeft:2}}>
					<Plus
						size={'$2'}
						color={'$accent1'}
					/>
				</TouchableOpacity>
			)
		}
		// 메시지 전송
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

			// 커스텀 버블 스타일 적용
			const renderBubble = (props) => {
				return (
					<Bubble
						{...props}
						wrapperStyle={{
							right: {
								backgroundColor: '#0084ff',
								marginVertical: 2,
								marginRight: 5,
								borderRadius: 18,
							},
							left: {
								backgroundColor: '#f0f0f0',
								marginVertical: 2,
								marginLeft: 5,
								borderRadius: 18,
							},
						}}
						textStyle={{
							right: {
								color: '#fff',
							},
							left: {
								color: '#000',
							},
						}}
						timeTextStyle={{
							right: {
								color: 'rgba(255, 255, 255, 0.7)',
								fontSize: 10,
							},
							left: {
								color: 'rgba(0, 0, 0, 0.5)',
								fontSize: 10,
							},
						}}
					/>
				);
			};
			
			

		return (
			
				<SafeAreaView style={{flex:1, backgroundColor: theme.color2.val}}>
					
					<CustomHeader showBackButton={true}>
						
					</CustomHeader>
					
					<GiftedChat
						messages={messages}
						onSend={messages => handleSendMessage(messages)}
						user={{_id: user?.uid ?? '', name: user?.email ?? undefined, avatar: user?.photoURL ?? undefined}}
						isKeyboardInternallyHandled={true}
						renderUsernameOnMessage={false}
						renderBubble={renderBubble}
						alignTop={false}
						showUserAvatar={false} // 내 아바타 보이게 하기
						onPressAvatar={()=>{console.log("click!")}}
						keyboardShouldPersistTaps={'handled'} // 키보드 닫기
						renderActions={chatLeftButton} // 메시지 입력창 왼쪽 버튼
						bottomOffset={Platform.OS === 'android' ? 0 : -40} // 키보드 활성화 상태일 때 메시지 입력창 위치 조절
						messagesContainerStyle={{
							paddingBottom: 10,
						}}
						minInputToolbarHeight={50}
					/>
					
					<BottomSheet
						ref={bottomSheetRef}
						index={1}
						snapPoints={snapPoints}
						enablePanDownToClose={true} // 
						keyboardBehavior="interactive"
						enableContentPanningGesture={false}
						// onChange={handleSheetCloseChanges}
						backdropComponent={renderBackdrop}
						backgroundStyle={{backgroundColor: theme.color1.val,
							...Platform.select({
								ios: {
									shadowColor:'#000',
									shadowOffset: {width:0, height: 10},
									shadowOpacity: 0.51,
									shadowRadius:13.16,
								},
								android: {
									elevation:24,
								}
							})
						}}
					>
						<BottomSheetView style={{ height:'100%', paddingRight: 10, paddingLeft: 10}}>
							<TouchableOpacity
								onPress={() => bottomSheetRef.current?.close()}
								style={{
									alignSelf: 'flex-end',
								}}
							>
								<X color={'$color'}/>
							</TouchableOpacity>

							{/* 업로드 메뉴 */}
							<XStack style={{ height: '100%', padding: 10 }}>
								<View style={{width:65, height:85, justifyContent:'center', alignItems:'center'}}>
									<TouchableOpacity
										onPress={() => {
											console.log("사진 업로드 선택됨");
											
										}}
										style={{
											width: 65,
											height: 65,
											backgroundColor: theme.color02.val,
											justifyContent:'center',
											alignItems: 'center',
											borderRadius: 60
										}}
									>
										<ImagePlus size={'$2'} style={{ marginRight: 8 }} />

									</TouchableOpacity>
									<Text>사진</Text>
								</View>
								<ChatMenuButton
									onPress={() => console.log('동영상')}
									icon={<Video size={'$2'}/>}
									title={'비디오'}
								/>
							</XStack>
						</BottomSheetView>
					</BottomSheet>

				</SafeAreaView>	
				
		)
	}

