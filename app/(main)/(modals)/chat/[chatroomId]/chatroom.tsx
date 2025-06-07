import { CustomHeader } from "@/components/CustomHeader";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, View, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Pressable, StyleSheet, Dimensions, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme, XStack, YStack } from "tamagui";
import { fetchChatUserInCache, sendMessage, subscribeToMessages } from "@/firebase/chat";
import { useAuth } from "@/hooks/useAuth";
import { ActionsProps, Bubble, Day, GiftedChat, IMessage, MessageImageProps } from "react-native-gifted-chat";
import { Camera, ImagePlus, Menu, Plus, Video, X } from "@tamagui/lucide-icons";
import BottomSheet, { BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { StatusBar } from "react-native";
import { ChatMenuButton } from "@/components/chat/chatMenuButton";
import { useThemeContext } from "@/hooks/useThemeContext";
import { pickImage } from "@/utils/imagePicker";
import { uploadChatImage } from "@/firebase/storage";
import Lightbox from "react-native-lightbox-v2"; // 이미지 확대 
import { Image } from 'expo-image';
	export default function ChatRoom() {
		const theme = useTheme();
		const {user} = useAuth();
		const router = useRouter();
		const {chatroomId} = useLocalSearchParams<{chatroomId: string}>();
		const [messages, setMessages] = useState<IMessage[]>([]); // 채팅 데이터
		const roomId = chatroomId as string;
		console.log("chatroomId : ", roomId);
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
		// 캨싱 로딩
		const [cacheLoading, setCacheLoading] = useState(false);
		// 캐싱 사용하기
		const [userCache, setUserCache] = useState<Record<string, any>>({});
		// 사용자 photoURL은 캐시에 저장해서 사용하기 (사용자의 프로필 이미지 변경 대비)
		useEffect(() => {
			const fetchUsers = async () => {
				const cache = await fetchChatUserInCache(roomId);
				console.log("chatroom cache check : ", cache);
				
				setUserCache(cache);
				setCacheLoading(true);
			}
			fetchUsers();
		}, [roomId]);

const handleRenderAvatar = useCallback((props) => {
  const uid = props.currentMessage?.user._id;
  const userInfo = userCache[uid];
	console.log("userInfo cache :" , userInfo);
  if (!userInfo || !userInfo.photoURL) {
    // 캐시가 아직 없거나 photoURL 없으면 기본 이미지 혹은 빈 뷰 처리
    return (
      <Image
        source={require('@/assets/images/Chill_guy.jpg')}  // 기본 아바타 이미지 경로
        style={{ width: 36, height: 36, borderRadius: 18 }}
      />
    );
  }

  return (
    <Image
      source={{ uri: userInfo.photoURL }}
      style={{ width: 36, height: 36, borderRadius: 18 }}
    />
  );
}, [userCache]);


		// 이미지 선택
		const selectImage = useCallback(async () => {
			bottomSheetRef.current?.close();
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
			bottomSheetRef.current?.close();
			try {
				const downloadURL = await uploadChatImage(imageUri, roomId);
				console.log('이미지 스토어 저장 : ', downloadURL);

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
					giftedMessage: imageMessage,
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


		// 바텀 시트 실행 함수
		const openBottomSheet = () => {
			console.log("바텀 시트 실행", bottomSheetRef.current);
			bottomSheetRef.current?.expand();
		};

		// 배경 터치 시 BottomSheet 닫기
		const renderBackdrop = useCallback(
			(props: any) => (
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
						giftedMessage: message,
					})
				} catch (e) {
					console.error("sendMessage error : ", e);
				}
				
			})
		}, [roomId])

		// 커스텀 버블 스타일 적용
		const renderBubble = (props:any) => {
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
							color: theme.color2.val,
							fontSize: 10,
						},
						left: {
							color: theme.color11.val,
							fontSize: 10,
						},
					}}
					usernameStyle={{
						color: theme.color11.val
					}}
				/>
			);
		};

		// 이미지 메시지 커스텀
		const renderCustomMessageImage = (props: MessageImageProps) => {
			const { currentMessage } = props;
		
			// 디버깅 로그 추가
			console.log('이미지 렌더링:', currentMessage?.image);
			if (!currentMessage?.image) return null;
		
			return (
				<View style={{padding:3}}>
					<Lightbox			
						swipeToDismiss={true}
						renderContent={() => (
							<Image
								source={{ 
									uri: currentMessage.image,	
								}}
								style={{
									backgroundColor: 'black', width:'100%', height: '100%' 
									
								}}
								contentFit="contain"
							/>
						)}
					>
						<Image
							source={{ uri: currentMessage.image }}
							style={{ width: 200, height: 150, borderRadius: 12 }}
							contentFit="cover"
						/>
					</Lightbox>
				</View>
			);
		};
		// 채팅창 가운데 날짜 커스텀
		const renderCustomDay = (props: any) => {
			return (
				<Day
					{...props}
					textStyle={{
						color: theme.color1.val, // 흰색 텍스트
						fontSize: 12,
						fontWeight: '600',
					}}
					wrapperStyle={{
						backgroundColor: theme.color10.val, // 배경색 변경
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
						<TouchableOpacity style={{marginRight:10}} onPress={()=>{router.push(`/(main)/(modals)/chat/${roomId}/menu`)}}>
							<Menu />
						</TouchableOpacity>
						
					</CustomHeader>
					{cacheLoading && (
						<GiftedChat
						messages={messages}
						onSend={messages => handleSendMessage(messages)}
						user={{_id: user?.uid ?? '', name: user?.email?.split('@')[0] ?? undefined}}
						renderAvatar={handleRenderAvatar}
						
						isKeyboardInternallyHandled={true}
						renderUsernameOnMessage={true}
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
						// renderChatFooter={} //MessageContainer 아래에 렌더링할 사용자 정의 구성 요소(ListView와 별도)
						// renderInputToolbar={} //사용자 정의 메시지 작성기 컨테이너
						isScrollToBottomEnabled={true} // 메시지 최하단으로 이동하는 버튼
						showAvatarForEveryMessage={true}
						renderAvatarOnTop={true}
						onLongPress={() => console.log('cje')}
					/>
					)}
					
					
					<BottomSheet
						ref={bottomSheetRef}
						index={-1}
						snapPoints={snapPoints}
						enablePanDownToClose={true} 
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

