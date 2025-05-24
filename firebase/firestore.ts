import {
  collection, addDoc, Timestamp, query, orderBy, getDocs, 
  startAfter,limit, QueryDocumentSnapshot, DocumentData, doc, getDoc,
  onSnapshot, updateDoc,
  } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { commentProps, getChatroomProps, postUploadProps } from '@/type/firebaseType';

import { IMessage } from 'react-native-gifted-chat';
import { uploadChatroomImage } from './storage';
import { toDate } from '../node_modules/date-fns/fp/toDate';

// 회원가입

let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null;

// 게시글 업로드
export const uploadPostToFirestore = async({title, content, imageUrls, major, userId}: postUploadProps) => {
  const docRef = await addDoc(collection(db, major), {
    title, // 제목 
    content, // 내용
    imageUrls, // 이미지
    userId, // 아이디(이메일)
    createdAt: Timestamp.now(), // 작성일
  })
  return docRef.id; // 업로드한 게시글의 id 값
}

// 게시글 조회
export const fetchPosts = async (major: string, reset: boolean=false, pageSize: number = 10) => {
  const q = query(
    collection(db, major),
    orderBy('createdAt', 'desc'),
    ...(lastVisible && !reset ? [startAfter(lastVisible)] : []),
    limit(pageSize) 
  )

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs;
  console.log("게시글 개수 : ", docs.length);
  if(docs.length > 0) {
    lastVisible = docs[docs.length - 1];
  }

  const posts = docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      title: data.title,
      content: data.content,
      imageUrls: data.imageUrls?.[0] || null,
    };
  });
  console.log("map에 있는 docs 개수 : ", posts.length);
  return posts;
}
// 리스트를 초기화 할 때 사용 (새로고침 등)
export const resetPagination = () => {
  lastVisible = null;
}

// 게시글 상세 조회
export const getDetailPost = async (major: string, postId: string) => {
  const docRef = doc(db, major, postId);
  const docSnap = await getDoc(docRef); 
  
  console.log("docSnap.data()", docSnap.data());
  
  // 파이어베이스에 문서가 존재할 때 
  if(docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id, // 문서 ID
      title: data.title, // 게시글 제목
      content: data.content, // 게시글 내용
      imageUrls: data.imageUrls, // 게시글 이미지
      major: data.major, // 전공
      userId: data.userId, // 게시글 작성자
      createdAt: data.createdAt.toDate(), // 게시글 작성일
    };
  } else {
    throw new Error('게시글을 찾을 수 없습니다.');
  }
}

// 댓글 추가
export const addComment = async({major, postId, comment, userId}:commentProps) => {
  try{
    await addDoc(
      collection(db, major, postId, "comments"), 
      {
        userId: userId,
        content: comment,
        createdAt: Timestamp.now(),
      }
    );
  } catch(error) {
    console.error("Error add comment: ", error)
  }
};

// 댓글 조회
export const getComments = async ({ major, postId }: { major: string; postId: string }) => {
  const q = query(
    collection(db, major, postId, "comments"),
    orderBy("createdAt", "asc")
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    console.log("data data : ", data);
    const createdAt = (data.createdAt as Timestamp).toDate();
    console.log("firebase createdAt : ", createdAt);
    return {
      commentId: doc.id,
      content: data.content,
      userId: data.userId,
      createdAt: createdAt
    };
  });
};
// 채팅방 생성
export const createChatroom = async ({title, explain, imageUri}: {title:string, explain:string, imageUri:string|null}) => {
  
  try{
    // 채팅방 문서 추가 (return 채팅방 id)
    const chatroomRef = await addDoc(collection(db, 'chatrooms'),{
      title, // 채팅방 제목
      explain, // 채팅방 설명
      createdAt: Timestamp.now() // 채팅방 생성 날짜
    })
    const chatroomId = chatroomRef.id;
    
    // 이미지 업로드 후 imageURL을 문서에 업데이트
    if(imageUri) {
      const imageURL = await uploadChatroomImage(imageUri, chatroomId);
      
      await updateDoc(doc(db, 'chatrooms', chatroomId), {
        imageURL,
      });
    }

    return chatroomId;
    
  } catch(error) {
    console.log(error);
  }
}
// 채팅방 리스트 조회
export const getChatroomList = async () => {
  
  try {
    const chatroomRef = collection(db, 'chatrooms');
    const chatroomQuery = query(chatroomRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(chatroomQuery);

    const chatrooms = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }))
    return chatrooms;
  } catch(error) {
    console.error('채팅방 목록 조회 오류 : ', error);
    return [];
  }
  
}

// 채팅 메시지 조회 
export const subscribeToMessages = (chatroomId: string, callback:(message: any) => void) => {
  const messageRef = collection(db, 'chatrooms', chatroomId, 'messages');
  const q = query(messageRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, snapshot => {
    const messages = snapshot.docs.map((doc) => {
			const data = doc.data();
			return {
				_id: data._id,
				text: data.text,
				createdAt: data.createdAt?.toDate?.() ?? new Date(),
				user: data.user,
        image: data.image
			}
		});
    callback(messages);
  });
}
// 채팅보내기
export const sendMessage = async ({chatroomId, message}:{chatroomId:string; message: IMessage;}) => {
  const {_id, user, text, image} = message;
  const safeUser = {
    _id: user._id,
    name: user.name,
    ...(user.avatar ? {avatar: user.avatar}: {}) // 아바타 이미지가 없을 때 대비
  }

	const messageRef = collection(db, 'chatrooms', chatroomId, 'messages');

  const baseMessageData = {
    _id: message._id, // 메시지 id
    user: safeUser, // 유저 정보
    text: message.text || '', // message text
    createdAt: Timestamp.now(),
  };

  // 이미지가 있는 경우에만 image 필드 추가
  const messageData = image 
  ? { ...baseMessageData, image } 
  : baseMessageData;

	await addDoc(messageRef, messageData)
}

