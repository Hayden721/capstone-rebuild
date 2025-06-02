import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { chatUserCheckProps, enterChatroomProps, sendMessageProps } from '@/type/chatType';


// 채팅보내기
// export const sendMessage = async ({chatroomId, message}:{chatroomId:string, message: IMessage}) => {
//   const {_id, user, text, image} = message;
//   const safeUser = {
//     _id: user._id,
//     name: user.name,
//     ...(user.avatar ? {avatar: user.avatar}: {}) // 아바타 이미지가 없을 때 대비
//   }

// 	const messageRef = collection(db, 'chatrooms', chatroomId, 'messages');

//   const baseMessageData = {
//     _id: _id, // 메시지 id
//     user: safeUser, // 유저 정보
//     text: text , // message text
//     createdAt: Timestamp.now(),
//   };

//   // 이미지가 있는 경우에만 image 필드 추가
//   const messageData = image 
//   ? { ...baseMessageData, image } 
//   : baseMessageData;

// 	await addDoc(messageRef, messageData)
// }

export const sendMessage = async({chatroomId, giftedMessage}:sendMessageProps ) => {
	const image = giftedMessage.image;
	const messageRef = collection(db, 'chatrooms', chatroomId, 'messages');
	// firestore에 저장할 데이터 (_id: 메시지 id 값, text: 메시지, user: , createdAt: 메시지 작성일)
	const defalutChatData = {
		_id: giftedMessage._id,
		text: giftedMessage.text,
		user: giftedMessage.user,
		createdAt: Timestamp.now(),
	}
	// 이미지 채팅일 경우
	const chatData = image 
  ? { ...defalutChatData, image } 
  : defalutChatData;


	await addDoc(messageRef, chatData);
}


// 채팅 메시지 조회 
export const subscribeToMessages = (chatroomId: string, callback:(message: any) => void) => {
  const messageRef = collection(db, 'chatrooms', chatroomId, 'messages');
  const q = query(messageRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, snapshot => {
    const messages = snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				_id: data._id, // 채팅 메시지 id값
				text: data.text, // 채팅 메시지의 내용
				createdAt: data.createdAt?.toDate?.() ?? new Date(), // 보낸 시간
				user: data.user, // 유저 정보
        image: data.image // 이미지 채팅
			}
		});
    callback(messages);
  });
}


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
export const enterUserToChatroom = async (chatroomId: string, userUID: string) => {
	try {
		const chatroomRef = doc(db, "chatrooms", chatroomId);

		await updateDoc(chatroomRef, {
			users: arrayUnion(userUID)
		});
		console.log("유저 등록 성공")
	} catch(e) {
		console.error("채팅방 입장 시 유저 등록 실패 : ", e );
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

export const getChatSubscribeUser = async (chatroomId: string)=> {
	// 1. chatrooms에 참가중인 users 데이터 가지고 오기
	// user의 전체 데이터 (/chatrooms/{chatroomId}/users)
	const usersSnapshot = await getDocs(collection(db, "chatrooms", chatroomId, "users"));
	
	// 2. Promise.all()을 사용하여 모든 비동기 작업이 완료될 때까지 기다린다.
	const chatUsers = await Promise.all(
		// uid, photoURL, email, enteredAt 데이터를 map에 담기
		usersSnapshot.docs.map(async (userDoc) => {
			// 채팅방 참여 유저의 데이터(uid, photoURL, email)
			const userData = userDoc.data();
			console.log("usersData : ", userData );
			// chatrooms/{문서}/users/{userUID 문서}의 uid 값 추출
			const userUid = userDoc.id;
			console.log("userUid : ", userUid);
			// 추출한 uid를 통해 users의 userUID의 문서 데이터 조회
			const userProfileRef = doc(db, "users", userUid);
			const userProfileSnap = await getDoc(userProfileRef);
			// userUID의 문서가 존재하면 데이터를 추출
			const profileData = userProfileSnap.exists() ? userProfileSnap.data() : null;
			// 리턴값 (uid, email, users의 데이터(photoURL, ...))
			return {
				uid: userUid,
				email: userData.email,
				...profileData
			}
		})
	);
	
	return chatUsers;
}
// 내가 참가중인 채팅방 조회
// export const getMyChatrooms = async (userUID: string) => {
// 	// 내 email을 통해 chatrooms/[문서]/users/{userUID}에서 select
// 	// 1. 채팅방 전체를 조회
// 	const myChatroomsSnapshot = await getDocs(collection(db, "chatrooms"));
// 	// 2. 내가 참가중인 채팅방 데이터를 담을 배열 생성
// 	const myChatrooms = [];
// 	// 3. for문을 통해 전체 채팅방 중에서 내가 포함된 채팅방만 추출해서 myChatrooms 배열에 추가
// 	for(const chatroom of myChatroomsSnapshot.docs) {
// 		const userRef = doc(db, "chatrooms", chatroom.id, "users", myUid)
// 	}
// }