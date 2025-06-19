import {
  collection, addDoc, Timestamp, query, orderBy, getDocs, 
  startAfter,limit, QueryDocumentSnapshot, DocumentData, doc, getDoc,
  onSnapshot, updateDoc,
	where,
	setDoc,
	deleteDoc,
	increment,
	QuerySnapshot,
  } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { getTodoProps } from '@/type/todoType';



export const getTodo = async (userUID: string): Promise<Record<string, getTodoProps[]>> => {
	try {
		const todoRef = collection(db, 'users', userUID, 'todos');
		const q = query(todoRef, orderBy("createdAt", "desc"))
		const todoSnap = await getDocs(q);
		// key: date, value : {todoId, content, isComplete}
		const groupByDateMap: Record<string, getTodoProps[]> = {};
		
		todoSnap.docs.map((todo) => {
			const data = todo.data();
			const createdAt = data.createdAt.toDate();
			console.log("cratedAt look : ", createdAt);
			const dateKey = createdAt.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형태의 key
			console.log("날짜 키 : ", dateKey);
			// {todoId, content}
			const todoItem: getTodoProps = {
				todoId: todo.id,
				content: data.content,
				isComplete: data.isComplete,
				createdAt: createdAt,
			};
			
			if(!groupByDateMap[dateKey]){
				groupByDateMap[dateKey]= [];
			}
			groupByDateMap[dateKey].push(todoItem);
		});
		console.log("date를 key로 한 맵 : ", groupByDateMap);
		return groupByDateMap;

	} catch(e) {
		console.error("todo 조회 실패 : ", e );
		return {};
	}
}

export const getTodayTodo = async (userUID: string): Promise<getTodoProps[]> => {
	try {
		const todoRef = collection(db, "users", userUID, "todos");
		const now = new Date();
		const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 오늘 00:00
		const todayEnd =  new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // 내일 00:00
		const q = query(
			todoRef, 
			orderBy("createdAt", "desc"),
			where("createdAt", ">=",todayStart),
			where("createdAt", "<", todayEnd)
		)
		const todoSnap = await getDocs(q);
		const todos: getTodoProps[] = todoSnap.docs.map((doc) => {
			const data = doc.data();
			return {
				todoId: doc.id,
				content: data.content,
				isComplete: data.isComplete,
				createdAt: data.createdAt.toDate(),
			};
		});
		return todos;
			
	} catch(e) {
		console.error("오늘 todo 가져오기 실패 : ", e);
		return [];
	}
}

export const addTodo = async (userUID: string, content: string) => {
	try {
		const todoRef = collection(db, 'users', userUID, 'todos');
		
		await addDoc(todoRef, {
			content: content,
			userUID: userUID,
			createdAt: Timestamp.now(),
			isComplete: false,
		})

	}catch(e: any) {
		console.error("todo 저장 실패 : ", e);
		throw e;
	}
}

export const updateTodo = () => {

}

export const deleteTodo = () => {

}