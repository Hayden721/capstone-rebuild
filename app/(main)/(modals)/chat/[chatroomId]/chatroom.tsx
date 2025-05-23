import { CustomHeader } from "@/components/CustomHeader";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, View, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Pressable, StyleSheet, Dimensions, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text, useTheme, XStack, YStack } from "tamagui";
import { sendMessage, subscribeToMessages } from "@/firebase/firestore";
import { useAuth } from "@/hooks/useAuth";
import { ActionsProps, Bubble, Day, GiftedChat, IMessage, MessageImageProps } from "react-native-gifted-chat";
import { Camera, ImagePlus, Plus, Video, X } from "@tamagui/lucide-icons";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { StatusBar, Image } from "react-native";
import { ChatMenuButton } from "@/components/chat/chatMenuButton";
import { useThemeContext } from "@/hooks/useThemeContext";
import { pickImage } from "@/utils/imagePicker";
import { uploadChatImage } from "@/firebase/storage";

	export default function ChatRoom() {
		const theme = useTheme();
		const {chatroomId} = useLocalSearchParams<{chatroomId: string}>();
		const [messages, setMessages] = useState<IMessage[]>([]); // 채팅 데이터
		const roomId = chatroomId as string;
		const {user} = useAuth();
		const [isUploading, setIsUploading] = useState(false); // 이미지 업로드 상태
		// 바텀시트
		const bottomSheetRef = useRef<BottomSheet>(null);
		const snapPoints = useMemo(() => ['40%'],[]);
		const { themeMode } = useThemeContext(); // 테마 상태 
		const menuItmes = [
			{
				id: 1,
				title: '사진',
				icon: <ImagePlus size={'$2'}/>,
				onPress: () => selectImage()
			},
			{
				id:2,
				title: '카메라',
				icon: <Camera size={'$2'}/>,
				onPress: ()=> console.log('2'),
			},
			{
				id:3,
				title: '비디오',
				icon: <Video size={'$2'}/>,
				onPress: ()=> console.log('2'),
			},
		]

		const selectImage = useCallback(async () => {
			try {
				const selectedImageUris = await pickImage({maxImages: 1, currentUris: []});
				if(selectedImageUris && selectedImageUris.length > 0) {
					await handleImageUpload(selectedImageUris[0]);
				} 
				bottomSheetRef.current?.close();
			}catch (e) {
				console.log('이미지 선택 실패', e);
				Alert.alert('오류', '이미지 선택에 실패했습니다.')
			}
		},[])

		// 이미지 업로드 및 메시지 전송
		const handleImageUpload = useCallback(async(imageUri: string)=> {
			if(!user) return;
			setIsUploading(true);
			try {
				const downloadURL = await uploadChatImage(imageUri, roomId);
				const imageMessage: IMessage = {
					_id: Math.random().toString(36).substring(7),
					text: '',
					createdAt: new Date(),
					user: {
						_id: user.uid ?? '',
						name: user.email ?? '',
						avatar: user.photoURL ?? undefined
					},
					image: downloadURL
				};
				await sendMessage({
					chatroomId: roomId,
					message: imageMessage,
				})
			} catch(e) {
				console.error('이미지 업로드 실패', e);
				Alert.alert('오류', '이미지 채팅 전송 실패');
			} finally{
				setIsUploading(false);
			}

		},[user, roomId]);

		// 실시간 채팅 메시지 조회
		useEffect(() => {
			const unsubscribe = subscribeToMessages(roomId, (message) => {
				setMessages(message); //callback
			});
			return () => unsubscribe();
		}, [chatroomId]);

		const openBottomSheet = () => {
			console.log("바텀 시트 실행", bottomSheetRef.current);
			bottomSheetRef.current?.expand();
		};
		// 사진 메시지 전송 
		const imageChat = async () => {

		}

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
							backgroundColor: theme.accent1.val,
							marginVertical: 2,
							marginRight: 5,
							borderRadius: 18,
						},
						left: {
							backgroundColor: theme.color02.val,
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
							color: theme.color12.val,
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

		const renderCustomMessageImage = (props: MessageImageProps) => {
			return (
				<View style={{ borderRadius: 12, padding: 4 }}>
					<Image
						source={{ uri: props.currentMessage?.image }}
						style={{ width: 200, height: 150, borderRadius: 12 }}
						resizeMode="cover"
					/>
				</View>
			);
		};
		
		const renderCustomDay = (props) => {
			return (
				<Day
					{...props}
					textStyle={{
						color: '#FFFFFF', // 흰색 텍스트
						fontSize: 12,
						fontWeight: '600',
					}}
					wrapperStyle={{
						backgroundColor: theme.color12.val, // 배경색 변경
						paddingHorizontal: 12,
						paddingVertical: 6,
						borderRadius: 15,
						marginVertical: 8,
					}}
				/>
			)
		}
			

		return (
			
				<SafeAreaView style={{flex:1, backgroundColor: theme.color2.val}}>
					<StatusBar 
						barStyle={themeMode === 'light' ? 'dark-content' : 'light-content'}
						
						backgroundColor={theme.color2.val}
					/>
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
						renderDay={renderCustomDay}
						renderMessageImage={renderCustomMessageImage}
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
							<XStack style={{height: '100%', padding: 15, flexWrap: 'wrap', justifyContent: 'center'}}>
								<View style={{
									flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start', alignItems:'flex-start', width:'100%'
								}}>
									{menuItmes.map((item)=>(
										<View key={item.id} style={{width:'25%', marginBottom: 5, alignItems:'center', justifyContent:'center'}}>
											<ChatMenuButton
												onPress={item.onPress}
												title={item.title}
												icon={item.icon}
											/>
										</View>
									))}
								</View>
							</XStack>
						</BottomSheetView>
					</BottomSheet>

				</SafeAreaView>	
				
		)
	}

