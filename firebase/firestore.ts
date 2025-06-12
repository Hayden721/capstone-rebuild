import {
  collection, addDoc, Timestamp, query, orderBy, getDocs, 
  startAfter,limit, QueryDocumentSnapshot, DocumentData, doc, getDoc,
  onSnapshot, updateDoc,
  } from 'firebase/firestore';
import { auth, db } from '../firebase';

import { uploadChatroomImage } from './storage';



// 채팅방 생성
export const createChatroom = async ({
  title, explain, imageUri, userUID
}: {
  title:string, explain:string, imageUri:string|null, userUID:string|undefined|null
}): Promise<string> => {
  
  try{
    // 채팅방 문서 추가 (return 채팅방 id)
    const chatroomRef = await addDoc(collection(db, 'chatrooms'),{
      title, // 채팅방 제목
      explain, // 채팅방 설명
      createdAt: Timestamp.now(), // 채팅방 생성 날짜
      users: userUID ? [userUID]: [], 
      admin: userUID ?? ''
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
    throw new Error("채팅방 생성 실패"); 
  }
}
// 채팅방 리스트 조회
export const getChatroomList = async () => {
  
  try {
    const chatroomRef = collection(db, 'chatrooms');
    const chatroomQuery = query(chatroomRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(chatroomQuery);
    
    console.log("채팅방 리스트 querySanpshot : ", querySnapshot);
    const chatrooms = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      //필드
      // amdin, createdAt, explain, users, imageURL
    }))
    return chatrooms;
  } catch(error) {
    console.error('채팅방 목록 조회 오류 : ', error);
    return [];
  }
  
}


