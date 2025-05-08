import Divider from "@/components/Divider";
import { Camera } from "@tamagui/lucide-icons";
import React from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, Pressable, Alert } from "react-native";
import { Avatar, H1, H2, useTheme, YStack, Text, XStack, H3, H4, H5, H6, Switch } from "tamagui";
import { firebaseDeleteAccount, firebaseLogout } from "@/firebase/auth";
import { useRouter } from "expo-router";
import { ThemeToggleButton } from "@/components/ThemeToggle";



export default function My() {
	const theme = useTheme();
	const router = useRouter();
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
		<ScrollView style={{flex:1, padding: 10, backgroundColor: theme.color1.val}}>
			{/* 프로필 이미지 변경 */}
			<XStack>
				<View style={{position: 'relative',alignSelf:'flex-start'}}>
					<Avatar circular size="$8">
						<Avatar.Image src={require('@/assets/images/Chill_guy.jpg')} />
					</Avatar>
					<TouchableOpacity style={styles.imageButton}>
							<Camera size="$1.5"/>
					</TouchableOpacity>
				</View>
				<Text style={{fontSize: 18}}>이메일</Text>
			</XStack>

			<Divider/>
			
			<YStack>
				<H6>계정</H6>
				<TouchableOpacity onPress={()=> router.navigate('/(main)/(tabs)/(my)/chagePassword')} 
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
	}
});