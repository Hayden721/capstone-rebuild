import { addDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { enterChatroomProps } from '@/type/chatType';


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