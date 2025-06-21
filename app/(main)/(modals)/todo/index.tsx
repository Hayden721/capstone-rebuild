


import { CustomHeader } from "@/components/CustomHeader";
import { getTodayTodo, getTodo, updateTodo } from "@/firebase/todo";
import { useAuth } from "@/hooks/useAuth";
import { getTodoProps } from "@/type/todoType";
import { Check, PlusSquare } from "@tamagui/lucide-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, YStack, Text, XStack, Checkbox } from "tamagui";

export default function TodoList () {
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
	);

	const handleTodoUpdate = async(todoId: string, currentState: boolean) => {
		if(!user?.uid) {
			return;
		}
		await updateTodo(user.uid, todoId, !currentState)
		const updatedTodos = await getTodo(user.uid);
		setTodos(updatedTodos);
	};
	
	return (
		<SafeAreaView style={{backgroundColor: theme.color1.val, flex:1}}>
			<CustomHeader showBackButton={true} title="할 일 리스트">
				<TouchableOpacity onPress={()=> router.push('/(main)/(modals)/todo/create')}>
					<PlusSquare size={25} />
				</TouchableOpacity>
			</CustomHeader>
			
			<ScrollView style={{padding:10}}>
				{Object.entries(todos).map(([date, todoList]) => (
					
					<YStack key={date} style={{marginBottom: 15}}>
						<Text style={{fontSize: 20, marginBottom:8, fontWeight:'700'}}>{date}</Text>
						{todoList.map((todo) => (
							<XStack key={todo.todoId} style={{alignItems: 'center', marginBottom:10}}>
								<Checkbox size="$6" 
									style={{backgroundColor: theme.color3.val, marginRight:4}} 
									checked={todo.isComplete} 
									onCheckedChange={() => handleTodoUpdate(todo.todoId, todo.isComplete)}>
									<Checkbox.Indicator style={{backgroundColor: theme.color3.val}}>
										<Check color={'$color12'}/>
									</Checkbox.Indicator>
								</Checkbox>
								<TouchableOpacity style={{flex:1, alignContent:'center'}} onPress={()=> router.push(`/(main)/(modals)/todo/${todo.todoId}/edit`)} disabled={todo.isComplete}>
									<Text style={{fontSize: 18, color: todo.isComplete ? '#aaa':theme.color12.val, textDecorationLine: todo.isComplete ? 'line-through':'none'}}>{todo.content}</Text>
								</TouchableOpacity>
							</XStack>
						))}
					</YStack>
				))}
			</ScrollView>
		</SafeAreaView>
	)
}