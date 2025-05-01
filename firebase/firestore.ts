import {
  collection, addDoc, Timestamp, query, orderBy, getDocs, 
  startAfter,limit, QueryDocumentSnapshot, DocumentData, doc, getDoc,
  onSnapshot,
  
  } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { commentProps, postProps } from '@/type/firebaseType';
import { getCommentProps } from '../type/firebaseType';
import { typeOf } from '../node_modules/uri-js/dist/esnext/util';

// 회원가입

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
