import {
  collection, addDoc, Timestamp, query, orderBy, getDocs, 
  startAfter,limit, QueryDocumentSnapshot, DocumentData, doc, getDoc
  } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { postProps } from '@/type/firebaseType';


let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null;


// 게시글 업로드
export const uploadPostToFirestore = async({title, content, imageUrls, major, userId}: postProps) => {
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
  console.log("docSnap.exists()", docSnap.exists());
  console.log("docSnap.data()", docSnap.data());
  if(docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id, 
      title: data.title,
      content: data.content,
      imageUrls: data.imageUrls,
      major: data.major,
      userId: data.userId,
      createdAt: data.createdAt.toDate(),
    };
  } else {
    throw new Error('게시글을 찾을 수 없습니다.');
  }
}