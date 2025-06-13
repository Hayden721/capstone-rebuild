import Divider from "@/components/Divider";
import { Camera } from "@tamagui/lucide-icons";
import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, Pressable, Alert } from "react-native";
import { Avatar, H1, H2, useTheme, YStack, Text, XStack, H3, H4, H5, H6, Switch, Spinner } from "tamagui";
import { firebaseDeleteAccount, firebaseLogout, updateProfileImage, updateUserPhotoURL } from "@/firebase/auth";
import { useRouter } from "expo-router";
import { ThemeToggleButton } from "@/components/ThemeToggle";
import pickImage from '@/utils/imagePicker'; // 이미지 픽커
import { useAuth } from "@/hooks/useAuth";
import { Modal } from "react-native";
import { auth } from '@/firebase';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function My() {
	const theme = useTheme();
	const router = useRouter();
	// const [imageUris, setImageUris] = useState<string[]>([]);
	const {user, setUser} = useAuth();
	const uid = user?.uid; // 유저 uid
	const [profileImage, setProfileImage] = useState<string|null>(null); // 프로필 이미지 url 조회
	const [userImgLoading, setUserImgLoading] = useState(false); // 이미지 업로드 로딩 상태
	

useEffect(() => {
  const user = auth.currentUser;
  if (user?.photoURL) {
    setProfileImage(user.photoURL); // 초기 이미지 설정
  }
}, []);

const handleUpdateProfileImage = async () => {
  setUserImgLoading(true);
  try {
    const picked = await pickImage({ maxImages: 1 });

    if (picked && picked.length > 0) {
			// 이미지 업데이트 (return : name, email, photoURL)
      await updateProfileImage(picked[0]);
			
      // Firebase Auth의 currentUser 새로고침
      await auth.currentUser?.reload();
      const refreshedUser = auth.currentUser;

      // firebase auth 상태 업데이트
      if (refreshedUser) {
        setUser(refreshedUser); // useAuth 상태 업데이트
        setProfileImage(`${refreshedUser.photoURL}?t=${Date.now()}`);

				await updateUserPhotoURL(refreshedUser.uid, refreshedUser.photoURL);

        // AsyncStorage 업데이트
        try {
          await AsyncStorage.setItem('user', JSON.stringify(refreshedUser));
          console.log("AsyncStorage에 변경된 유저 정보 저장 완료");
        } catch (error) {
          console.error("> AsyncStorage 저장 실패:", error);
        }
      }
    }
  } catch (e: any) {
    Alert.alert("프로필 이미지 변경 오류", e.message);
  } finally {
    setUserImgLoading(false);
  }
};

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
			<SafeAreaView style={{flex:1, backgroundColor: theme.color1.val}}>
				<ScrollView style={{flex:1, padding: 10, backgroundColor: theme.color1.val}}>
					{/* 프로필 이미지 변경 */}
					<XStack>
						<View style={{position: 'relative',alignSelf:'flex-start'}}>
							
							<Avatar key={profileImage} circular size="$8">
								<Avatar.Image src={profileImage} />
							</Avatar>
							<TouchableOpacity onPress={handleUpdateProfileImage} style={styles.imageButton}>
									<Camera size="$1.5"/>
							</TouchableOpacity>
						</View>
						<Text style={{fontSize: 18}}>{user?.email}</Text>
					</XStack>

					<Divider/>
					
					<YStack>
						<H6>계정</H6>
						<TouchableOpacity onPress={()=> router.navigate('/(main)/(modals)/my/changePassword')} 
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
			</SafeAreaView>
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