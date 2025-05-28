import { addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { chatUserCheckProps, enterChatroomProps } from '@/type/chatType';


export const addUserToChatroom = async ({chatroomId, userUid, userEmail}: enterChatroomProps) => {

	try {
		const chatroomRef = doc(db, "chatrooms", chatroomId, "users", userUid);
		await setDoc(chatroomRef, {
			uid: userUid,
			email: userEmail,
			enteredAt: new Date(),
		});
		console.log("채팅방에 유저 추가 완료");
	} catch(e) {
		console.error("채팅방에 유저 추가 실패 : ", e);
	}
}

// 채팅방 구독 유저 확인
export const checkChatroomSubscribeUser = async ({chatroomId, userUid}:chatUserCheckProps): Promise<boolean> => {
	try {
		const userDocRef = doc(db, "chatrooms", chatroomId, "users", userUid);
		const userDocSnap = await getDoc(userDocRef);
		
		return userDocSnap.exists();
	} catch(e) {
		console.error("채팅방에 해당 유저 존재하지 않음 : ", e);
		return false;
	}
}