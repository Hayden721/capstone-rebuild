import { CustomHeader } from "@/components/CustomHeader";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Input, Label, Spinner, Text, useTheme, YStack } from "tamagui";
import { PasswordValidator } from "@/components/input/PasswordValidator";
import { PasswordCheck } from "@/components/input/PasswordCheck";
import { firebaseChangePassword } from "@/firebase/auth";
import { router } from "expo-router";

export default function ChangePassword() {
	const theme = useTheme();
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [checkPassword, setCheckPassword] = useState('');
	const [changeLoading, setChangeLoading] = useState(false);

	const handleChangePassword = async (currentPw: string, newPw: string, checkPw: string) => {
		setChangeLoading(true);
		try {
			const result = await firebaseChangePassword({currentPw, newPw, checkPw});

			if(!result?.success) {
				console.log("변경 실패 : ", result?.message);
				return;
			}
			router.replace('/(main)/(tabs)/my');
			console.log(result.message);
		} catch(e) {
			console.error(e);
		} finally {
			setChangeLoading(false);
		}
	}

	return (
		<SafeAreaView style={{flex: 1, backgroundColor: theme.color1.val}} edges={['top']}>
			<CustomHeader showBackButton={true} title="비밀번호 변경">
			</CustomHeader>
			<YStack style={{flex:1, padding:10 }}>

				<Label fontSize={15}><Text style={{color: theme.color12.val}}>현재 비밀번호</Text></Label>
				<Input value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry
					placeholder='password' 
					style={styles.passwordInput} />

				<Label fontSize={15}><Text style={{color: theme.color12.val}}>새 비밀번호</Text></Label>
				<Input value={newPassword} onChangeText={setNewPassword} secureTextEntry
					placeholder='password' 
					style={styles.passwordInput} />
					<PasswordValidator password={newPassword}/>

				<Label fontSize={15}><Text style={{color: theme.color12.val}}>새 비밀번호 확인</Text></Label>
				<Input value={checkPassword} onChangeText={setCheckPassword} secureTextEntry
					placeholder='password' 
					style={styles.passwordInput} />
					<PasswordCheck password={newPassword} chkPassword={checkPassword}/>

				<Button onPress={() => handleChangePassword(currentPassword, newPassword, checkPassword)} style={{marginTop: 20, backgroundColor: theme.accent1.val}}>
					<Text style={{color: 'white'}}>비밀번호 변경</Text>
				</Button>		
			</YStack>

			{changeLoading && (
				<View style={styles.loadingOverlay}>
					<Spinner size='large' color="$accent1"/>
				</View>
			)}
			
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	passwordInput: {
		textAlignVertical:'center',
		lineHeight: 17,              // 텍스트 줄 높이
	},
	loadingOverlay: {
    ...StyleSheet.absoluteFillObject, // 전체 화면 덮기
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  }
})