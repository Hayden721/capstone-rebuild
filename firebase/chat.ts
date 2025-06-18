import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { chatUserCheckProps, enterChatroomProps, getChatroomProps, sendMessageProps } from '@/type/chatType';

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


// export const sendMessage = async({chatroomId, giftedMessage}:sendMessageProps ) => {
// 	const image = giftedMessage.image;
// 	const messageRef = collection(db, 'chatrooms', chatroomId, 'messages');
// 	// firestore에 저장할 데이터 (_id: 메시지 id 값, text: 메시지, user: , createdAt: 메시지 작성일)
// 	const defalutChatData = {
// 		_id: giftedMessage._id,
// 		text: giftedMessage.text,
// 		user: giftedMessage.user,
// 		createdAt: Timestamp.now(),
		
// 	}
// 	// 이미지 채팅일 경우
// 	const chatData = image 
//   ? { ...defalutChatData, image } 
//   : defalutChatData;

// 	await addDoc(messageRef, chatData);
// }

// 채팅방 참여 유저 캐시에 넣어서 사용
export const fetchChatUserInCache = async (chatroomId: string) => {
	// 유저 캐시 데이터 담을 곳
	const userCache: Record<string, any> = {};

	try {
		// 1. chatroom/user에서 채팅방에서 존재하는 userUID 조회하기
		const chatroomDoc = await getDoc(doc(db, "chatrooms", chatroomId));
		// 문서가 존재하지 않으면 return
		if(!chatroomDoc.exists()) {
			console.warn('chatroom/${chatroomId}에 문서가 존재하지 않음');
			return {};
		}
		const userUID = chatroomDoc.data().users;
		console.log("캐시 userUID : ",  userUID); // 일단 uid 가지고 옴
		// 2. userUID를 사용해서 /users/{userUID}의 데이터를 map 형식에 저장
		await Promise.all(
			userUID.map(async (uid: string) => {
				try{
					const userDoc = await getDoc(doc(db, "users", uid));
					if(userDoc.exists()) {
						const data = userDoc.data();
						userCache[uid] = {
							email: data.email,
							photoURL: data.photoURL
						}
					}
				}catch(e) {
					console.error('유저 정보 조회 실패 : ', e);
				}
			})
		)
		console.log("userCache에 저장됨 : ", userCache);
		return userCache;
	} catch(e) {
		console.error(e);
		return {};
	}
}

// 매시지 보내기
export const sendMessage = async({chatroomId, giftedMessage}:sendMessageProps ) => {
	const image = giftedMessage.image;
	const messageRef = collection(db, 'chatrooms', chatroomId, 'messages');
	// firestore에 저장할 데이터 (_id: 메시지 id 값, text: 메시지, user: , createdAt: 메시지 작성일)
	const defalutChatData = {
		_id: giftedMessage._id,
		user: giftedMessage.user,// 유저의 uid만 사용
		text: giftedMessage.text,
		createdAt: Timestamp.now(),
	}
	// 이미지 채팅일 경우
	const chatData = image 
  ? { ...defalutChatData, image } 
  : defalutChatData;

	await addDoc(messageRef, chatData);
} 

/**
 * 채팅 메시지 조회 
 * @param chatroomId - 채팅방 id
 * @param callback - 
 * @returns 
 */
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

/**
 * firestore에 /chatrooms/{chatroomId}/users/{userUID}문서에 userUid를 문서명으로 사용하고 유저 데이터 추가
 * @param param0 - chatroomId: 채팅방ID, uesrUid: user의 uid값, userEmail: 유저의 이메일 
 */
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

/**
 * firestore에 /chatrooms/{chatroomId}문서에 users 필드에서 users 배열에 추가
 * @param chatroomId - 채팅방 id
 * @param userUID - 유저 id 
 */
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

// 
/**
 * 채팅방 구독 유저 확인
 * @param param0 - chatroomId: 채팅방id, userUid: 유저uid
 * @returns 채팅방에 구독된 유저면 true or false
 */
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

/**
 * 
 * @param chatroomId - 채팅방 id
 * @returns 
 */
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
// 채팅방을 구독하고 있는 유저 email, photoURL 조회
// uid값을 활용해서 email과 photoURL 가지고 오기
export const getChatroomSubscribeUser = async(chatroomId: string) => {
	try{
		const subscribeUserRef = doc(db, "chatrooms", chatroomId);
		const docSnap = await getDoc(subscribeUserRef);

		if(docSnap.exists()) {
			const data = docSnap.data();
			
			const users: string[] = data.users || [];
			console.log("user배열 : ", users);
			

		} else {
			return [];
		}
	} catch(e) {
		console.error("chatrooms users 배열 데이터 가져오기 실패 : ", e);
	}
}

// 새로운 채팅방 조회 
export const getNewChatrooms = async (): Promise<getChatroomProps[]> => {
	const chatroomRef = collection(db, "chatrooms");
	const q = query(chatroomRef, orderBy('createdAt', 'desc'));
	const chatroomSnap = await getDocs(q);

	return chatroomSnap.docs.map((doc)=> {
		const data = doc.data();
		return {
			chatroomId: doc.id,
			...data,
			createdAt: data.createdAt.toDate(),
		} as getChatroomProps
	})

	
}