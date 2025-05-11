import Divider from "@/components/Divider";
import { Camera } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, Pressable, Alert } from "react-native";
import { Avatar, H1, H2, useTheme, YStack, Text, XStack, H3, H4, H5, H6, Switch, Spinner } from "tamagui";
import { firebaseDeleteAccount, firebaseLogout, firebaseUpdateProfileImage, getFirebaseProfileImage } from "@/firebase/auth";
import { useRouter } from "expo-router";
import { ThemeToggleButton } from "@/components/ThemeToggle";
import pickImage from '@/utils/imagePicker'; // 이미지 픽커
import { useAuth } from "@/hooks/useAuth";
import { uploadProfileImageAsync } from "@/firebase/storage";
import { Modal } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/firebase';

export default function My() {
	const theme = useTheme();
	const router = useRouter();
	const [imageUris, setImageUris] = useState<string[]>([]);
	const {user, setUser} = useAuth();
	const uid = user?.uid;
	const [profileImage, setProfileImage] = useState<string|null>(null); // 프로필 이미지 url 조회
	const [userImgLoading, setUserImgLoading] = useState(false);
	
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (authUser) => {
			if(authUser) {
				setUser(authUser);
			}else {
				setUser(null);
			}
		});
		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (user?.photoURL) {
			setProfileImage(`${user.photoURL}?init=${Date.now()}`);
		}
	}, [user?.photoURL]);
	// 프로필 사진 변경
	const handleImagePicker = async () => {
		const result = await pickImage({maxImages: 1, currentUris: imageUris});
		console.log("프로필 이미지", result);
		if(result && result.length > 0) {
			setImageUris(result);
			await handleProfileImageChange(result[0]);
			console.log("사진 업로드 실행")
		}
		
	}
	// 프로필 이미지 업로드 (return값: imageUrl)
	const handleProfileImageChange = async (imageUri: string) => {
		if(!user?.uid) return;

		setUserImgLoading(true);

		try{
			// 1. 이미지 업로드 후 이미지url 반환
		const url = await uploadProfileImageAsync(imageUri , uid);
		// 2. Firebase Auth 사용자 프로필 업데이트
		await firebaseUpdateProfileImage(url);
		// 3. 사용자 정보 리로드
		await auth.currentUser?.reload();
		const updateUser = auth.currentUser;
		if(updateUser) {
			setUser(updateUser);
			setProfileImage(`${updateUser.photoURL}?t=${Date.now()}`);
		}

		Alert.alert("프로필 사진을 변경했습니다.");
		} catch(error) {
			console.error("프로필 이미지 업로드 실패 : ", error);
		} finally {
			setUserImgLoading(false);
		}
		
	}

	//로그아웃
	const handleLogout = async () => {
		Alert.alert(
			'로그아웃',
			'로그아웃 하시겠습니까?',
			[
				{
					text: '아니요',
					style: 'cancel'
				},
				{
					text: '예',
					onPress: async () => {
						await firebaseLogout();
					},
				},
			],
			{ cancelable: true}
		)
	}
	// 비밀번호 변경 
	const handleChangePassword = () => {
		
	}

	// 회원 탈퇴
	const handleDeleteAccount = () => {
		Alert.alert(
			'회원탈퇴',
			'회원탈퇴 하시겠습니까?',
			[
				{
					text: '아니요',
					style: 'cancel'
				},
				{
					text: '예',
					onPress: async () => {
						await firebaseDeleteAccount();
					}
				}
			]
		)
	}

	return (
		<>
			<Modal
				visible={userImgLoading}
				transparent
				animationType="fade"
			>
				<View style={styles.modalOverlay}>
					<Spinner size="large" color="$accent1" />
				</View>
			</Modal>

			<ScrollView style={{flex:1, padding: 10, backgroundColor: theme.color1.val}}>

				{/* 프로필 이미지 변경 */}
				<XStack>
					<View style={{position: 'relative',alignSelf:'flex-start'}}>
						
						<Avatar key={profileImage} circular size="$8">
							<Avatar.Image src={profileImage} />
						</Avatar>
						<TouchableOpacity onPress={handleImagePicker} style={styles.imageButton}>
								<Camera size="$1.5"/>
						</TouchableOpacity>
					</View>
					<Text style={{fontSize: 18}}>이메일</Text>
				</XStack>

				<Divider/>
				
				<YStack>
					<H6>계정</H6>
					<TouchableOpacity onPress={()=> router.navigate('/(main)/(tabs)/my/chagePassword')} 
						style={{paddingTop:8, paddingBottom:8}}>
							<Text style={{fontSize:15}}>
								비밀번호 변경
							</Text>
					</TouchableOpacity>
				</YStack>
				<Divider/>

				<YStack>
				<H6>앱 설정</H6>
					<XStack style={{justifyContent: 'space-between'}}>
					<TouchableOpacity style={{paddingTop:8, paddingBottom:8}}><Text style={{fontSize:15}}>다크모드</Text></TouchableOpacity>
					<ThemeToggleButton/>
					</XStack>
				</YStack>
				<Divider/>

				<YStack>
					<H6>기타</H6>
					<TouchableOpacity onPress={handleLogout} style={{paddingTop:8, paddingBottom:8}}><Text style={{fontSize:15}}>로그아웃</Text></TouchableOpacity>
					<TouchableOpacity onPress={handleDeleteAccount} style={{paddingTop:8, paddingBottom:8}}><Text style={{fontSize:15}}>회원탈퇴</Text></TouchableOpacity>
				</YStack>
				<Divider/>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	imageButton: {
		width: 31,
		height: 31,
		borderRadius: 50,
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#999',
		bottom: 0,
		right: 0,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.3)',
		justifyContent: 'center',
		alignItems: 'center',
	}
});