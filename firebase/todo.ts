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

/**
 * 할 일 추가 
 * @param userUID - 등록하는 유저의 uid
 * @param content - todo의 내용
 */
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

/**
 * todo 상태 업데이트 (할 일 완료)
 * @param userUID - todo를 등록한 유저의 uid
 * @param todoId - todo의 id
 * @param newState - todo의 상태 (isComplete : true / false)
 */
export const updateTodo = async (userUID: string, todoId: string, newState:boolean) => {
	try {
		const todoRef = doc(db, "users", userUID, "todos", todoId);
		await updateDoc(todoRef, {isComplete: newState});
	}catch(e){
		console.error("todo 업데이트 실패 : ", e);
	}
}

/**
 * 선택한 todo 삭제 
 * @param userUID - todo를 등록한 유저의 uid
 * @param todoId - 삭제할 todo의 id
 */
export const deleteTodo = async (userUID: string, todoId: string) => {
	try {
		const todoRef = doc(db, "users", userUID, "todos", todoId);
		await deleteDoc(todoRef);
	} catch(e) {
		console.error("todo 삭제 실패 : ", e);
	}
}

/**
 * 수정할 todo의 데이터 조회하기
 * @param userUID - 유저의 uid
 * @param todoId - 조회할 todo의 id
 */
// export const getTodoById = async (userUID: string, todoId: string): Promise<getTodoProps | null> => {
// 	try {
// 		const todoRef = doc(db, "users", userUID, "todos", todoId);
// 		const todoSnap = await getDoc(todoRef);
				
		
// 		if(todoSnap.exists()){
// 			const data = todoSnap.data();
// 			return {
// 				todoId: todoSnap.id,
// 				isComplete: data.isComplete,
// 				createdAt: data.createdAt.toDate(),
// 				content: data.content,

// 			}as getTodoProps
// 		} else {
// 			console.warn("해당 todo 문서가 존재하지 않음");
// 			return null;
// 		}

// 	} catch (e) {
// 		console.error("수정할 todo의 데이터 조회 실패 : ", e);
// 		return null;
// 	}
// }

export const getTodoById = async (userUID: string, todoId: string): Promise<string | null> => {
	try {
		const todoRef = doc(db, "users", userUID, "todos", todoId);
		const todoSnap = await getDoc(todoRef);
		if(todoSnap.exists()) {
			const data = todoSnap.data();
			return data.content ?? null;
		} else {
			return null;
		}
	} catch(e) {
		console.error("편집할 todo 조회 실패 : ", e);
		return null;
	}
}


//todo 편집
export const editTodo = async (userUID: string, todoId: string, todoContent: string) => {
	try {
		const todoRef = doc(db, "users", userUID, "todos", todoId);
		await updateDoc(todoRef, {content: todoContent});

	} catch(e) {
		console.error("todo 수정 실패 : ", e );
	}
}
