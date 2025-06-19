


import { CustomHeader } from "@/components/CustomHeader";
import { getTodo } from "@/firebase/todo";
import { useAuth } from "@/hooks/useAuth";
import { getTodoProps } from "@/type/todoType";
import { Check, PlusSquare } from "@tamagui/lucide-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, YStack, Text, XStack, Checkbox } from "tamagui";

export default function todoList () {
	const theme = useTheme();
	const {user} = useAuth();
	const [todos, setTodos] = useState<Record<string, getTodoProps[]>>({});
	
	useFocusEffect(
		useCallback(()=> {
			const fetchTodo = async () => {
				if(!user?.uid){
					return;
				}
				const todo = await getTodo(user.uid);
				console.log("todo 데이터 : ", todo);
				setTodos(todo);
			}
			fetchTodo();
		}, [user?.uid])
	)

		// useEffect(() => {
		// 	const getTodoData = async () => {
		// 		if(!user?.uid){
		// 			return;
		// 		}
		// 		const todo = await getTodo(user.uid);
		// 		console.log("todo 데이터 : ", todo);
		// 		setTodos(todo);
				
		// 	}
		// 	getTodoData();
	
		// },[user?.uid])
	
	return (
		<SafeAreaView style={{backgroundColor: theme.color1.val, flex:1}}>
			<CustomHeader showBackButton={true} title="할 일 리스트">
				<TouchableOpacity onPress={()=> router.push('/(main)/(modals)/todo/create')}>
					<PlusSquare size={25} />
				</TouchableOpacity>
			</CustomHeader>
			
			<ScrollView style={{padding:10}}>
				{Object.entries(todos).map(([date, todoList]) => (
					
					<YStack key={date} >
						<Text style={{fontSize: 20, marginBottom:8}}>{date}</Text>
						{todoList.map((todo) => (
							<XStack style={{alignItems: 'center', marginBottom:8}}>
								<Checkbox size="$6" style={{backgroundColor: theme.color3.val, marginRight:4}}>
									<Checkbox.Indicator style={{backgroundColor: theme.color3.val}}>
										<Check color={'$color12'}/>
									</Checkbox.Indicator>
								</Checkbox>
								<Text style={{fontSize: 17, color: theme.color12.val}}>{todo.content}</Text>
							</XStack>
						))}

						
							
					</YStack>
				))

				}
			</ScrollView>

		</SafeAreaView>
	)
}