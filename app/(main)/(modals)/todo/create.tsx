import { CustomHeader } from "@/components/CustomHeader";
import { addTodo } from "@/firebase/todo";
import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, YStack, Text, Button, XStack} from "tamagui";
import { router } from 'expo-router';

export default function Create () {
	const theme = useTheme();
	const {user} = useAuth();
	const [content, setContent] = useState<string>('');

	const handleSubmitTodo = async () => {
		if(user?.uid){
			await addTodo(user?.uid, content);
			router.back();

		} else {
			console.error("사용자 로그인 상태 아님");
		}
	}

	return (
		<SafeAreaView style={{backgroundColor: theme.color1.val, flex:1}}>
			<CustomHeader showBackButton={true} title="할 일 추가">
			</CustomHeader>
			<YStack style={{padding: 10, flex:1, justifyContent:'center'}}>
				<TextInput 
					value={content}
					onChangeText={setContent}
					multiline={false} 
					style={{height: 50,fontSize:20, color: theme.color12.val}} 
					maxLength={50} 
					placeholder="새로운 할 일" 
					placeholderTextColor={theme.color12.val} />
				<XStack style={{justifyContent:'flex-end'}}>
				<Button onPress={() => handleSubmitTodo()} style={{marginTop: 10, backgroundColor: theme.accent1.val, width:100}} disabled={!content}>
					<Text color={'white'}>추가</Text>
				</Button>				
				</XStack>
			</YStack>
		</SafeAreaView>
	)
}