import { CustomHeader } from "@/components/CustomHeader";
import { addTodo, deleteTodo, editTodo, getTodoById } from "@/firebase/todo";
import { useAuth } from "@/hooks/useAuth";
import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, YStack, Text, Button, XStack, Label} from "tamagui";
import { router, useLocalSearchParams } from 'expo-router';
import { getTodoProps } from "@/type/todoType";
import { Trash2 } from "@tamagui/lucide-icons";


export default function Create () {
	const theme = useTheme();
	const {user} = useAuth();
	const {todoId} = useLocalSearchParams<{todoId:string}>();
	const [content, setContent] = useState<string|null>('');

	useEffect(() => {
		const fetchTodo = async() => {
			if(user?.uid) {
				const contentData = await getTodoById(user.uid, todoId);
				console.log("수정할 todo 데이터 : ", contentData);
		
				setContent(contentData);
			}
		}
		fetchTodo();
	}, []);

	const handleEditTodo = async () => {
		console.log("click")
		if(user?.uid && content !== null){
			await editTodo(user?.uid, todoId, content);
			router.back();

		} else {
			console.error("사용자 로그인 상태 아님");
		}
	}

	const handleDeleteTodo = async () => {
		console.log("click");
		if(user?.uid) {
			await deleteTodo(user?.uid, todoId);
			router.back()
		}
		
	}
	
	return (
		<SafeAreaView style={{backgroundColor: theme.color1.val, flex:1}}>
			
			<CustomHeader showBackButton={true} title="할 일 편집">
				<TouchableOpacity onPress={() => handleDeleteTodo()}>
					<Trash2 size={20}/>
				</TouchableOpacity>
			</CustomHeader>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : undefined}>
					<YStack style={{padding: 10, flex:1, marginTop:150}}>
						<TextInput 
							value={content ?? ''}
							onChangeText={setContent}
							multiline={false} 
							style={{height: 50,fontSize:20, color: theme.color12.val}} 
							maxLength={50} 
							placeholder="할 일 편집" 
							placeholderTextColor={'#ccc'} />
						<XStack style={{justifyContent:'flex-end'}}>
						<Button onPress={() => handleEditTodo()} style={{marginTop: 10, backgroundColor: theme.accent5.val, width:100}} disabled={content?.length === 0}>
							<Text color={'white'}>편집</Text>
						</Button>				
						</XStack>
					</YStack>
				</KeyboardAvoidingView>
			</TouchableWithoutFeedback>
		</SafeAreaView>
	)
}