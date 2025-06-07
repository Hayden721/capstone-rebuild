import {
  collection, addDoc, Timestamp, query, orderBy, getDocs, 
  startAfter,limit, QueryDocumentSnapshot, DocumentData, doc, getDoc,
  onSnapshot, updateDoc,
	where,
  } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { commentProps, postUploadProps } from '@/type/firebaseType';

let lastVisible: QueryDocumentSnapshot<DocumentData> | null = null;

// 게시글 조회
export const fetchPosts = async (category: string, reset: boolean=false, pageSize: number = 10) => {
	try {
		const q = query(
    collection(db, "posts"),
		where("category", "==", category),
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
      id: doc.id, // 게시물 id
      title: data.title, // 제목
      content: data.content, // 내용
			category: data.category, // 카테고리
			userUID: data.userUID, // 유저 uid
      imageURLs: data.imageURLs?.[0] || null, // imageURL
    };
  });
  console.log("map에 있는 docs : ", posts);
  return posts;

	}catch(e) {
		console.error("파이어베이스 게시글 조회 실패 : ", e);
	}
  
}
// 리스트를 초기화 할 때 사용 (새로고침 등)
export const resetPagination = () => {
  lastVisible = null;
}

// 게시글 업로드
export const uploadPostToFirestore = async({title, content, imageURLs, category, userUID, email}: postUploadProps) => {
  const docRef = await addDoc(collection(db, "posts"), {
    title, // 제목 
    content, // 내용
    imageURLs, // 이미지
    userUID, // UID()
    email, // email
    category,
    createdAt: Timestamp.now(), // 작성일
  })
  return docRef.id; // 업로드한 게시글의 id 값
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