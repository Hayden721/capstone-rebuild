import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { auth, storage } from '../firebase';

// 게시글 이미지 업로드
export const uploadImageAsync = async (uri: string, category: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const extension = uri.slice(uri.lastIndexOf('.'));

  const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}${extension}`;
  const userEmail = auth.currentUser?.email;

  const imageRef = ref(storage, `posts/${category}/${userEmail}/${filename}`);
  await uploadBytes(imageRef, blob);
  return await getDownloadURL(imageRef);
};

// 프로필 이미지
export const uploadProfileImageAsync = async (uri: string, uid: string|undefined): Promise<string> => {
  try {
    console.log("보낸 uid : ", uid);
    const response = await fetch(uri);
    const blob = await response.blob();
    const extension = uri.slice(uri.lastIndexOf('.')); // 파일 확장자명
    
    const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}${extension}`;
    const imageRef = ref(storage, `profile/${uid}/${filename}`); // 파이어베이스 storage에 저장 위치
    await uploadBytes(imageRef, blob);

    return await getDownloadURL(imageRef);
  } catch(error) {
    console.log("프로필 이미지 업로드 실패 : ", error);
    throw error;
  }
  
}

// 채팅방 이미지 업로드
export const uploadChatroomImage = async (uri: string, chatroomId: string) => {
  
  try{
    const response = await fetch(uri);
    const blob = await response.blob();
    const extension = uri.slice(uri.lastIndexOf('.')); // 파일 확장자명

    const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}${extension}`;
    const imageRef = ref(storage, `chatroom/${chatroomId}/${filename}`); // 파이어베이스 storage에 저장 위치
    
    await uploadBytes(imageRef, blob);

    return await getDownloadURL(imageRef);
  } catch(error) {
    console.log("> 채팅방 이미지 업로드 실패 : ", error);
  }
}

// 채팅방 이미지 업로드
export const uploadChatImage = async (uri: string, chatroomId: string) => {
  
  try{
    const response = await fetch(uri);
    const blob = await response.blob();
    const extension = uri.slice(uri.lastIndexOf('.')); // 파일 확장자명

    const filename = `${Date.now()}_${Math.random().toString(36).substring(7)}${extension}`;
    const imageRef = ref(storage, `chatroom/${chatroomId}/imageMessage/${filename}`); // 파이어베이스 storage에 저장 위치
    
    await uploadBytes(imageRef, blob);

    return await getDownloadURL(imageRef);
  } catch(error) {
    console.log("> 채팅방 이미지 업로드 실패 : ", error);
  }
}