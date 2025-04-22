import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

// 게시글 업로드
export const uploadPostToFirestore = async({title, content, imageUris, major, userId}) => {
  return await addDoc(collection(db, major), {
    title,
    content,
    imageUris,
    userId,
    createdAt: Timestamp.now(),
  })
}