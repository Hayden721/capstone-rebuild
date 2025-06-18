import {
  collection, addDoc, Timestamp, query, orderBy, getDocs, 
  startAfter,limit, QueryDocumentSnapshot, DocumentData, doc, getDoc,
  onSnapshot, updateDoc,
	where,
	setDoc,
	deleteDoc,
	increment,
  } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { addCommentProps, addPostProps, postProps1 } from '@/type/firebaseType';

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
export const uploadPostToFirestore = async({title, content, imageURLs, category, userUID, email}: addPostProps) => {
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
export const getDetailPost = async (postId: string) => {
  const docRef = doc(db, "posts", postId); // 조회할 위치 /posts/{postID}
  const docSnap = await getDoc(docRef);  
	console.log("docSnap.data()", docSnap.data());
	
  // 파이어베이스에 문서가 존재할 때 
  if(docSnap.exists()) {
    const data = docSnap.data();
		const uesrUID = data.userUID; // 작성한 유저의 uid
		let photoURL = null; // 유저의 프로필 이미지 담을 변수

		if(uesrUID) {
			const userDocRef = doc(db, "users", uesrUID);
			const userDocSnap = await getDoc(userDocRef);
			if(userDocSnap.exists()) {
				const userData = userDocSnap.data();
				photoURL = userData.photoURL;
			}
		}

    return {
      id: docSnap.id, // 문서 ID
      title: data.title, // 게시글 제목
      content: data.content, // 게시글 내용
      imageURLs: data.imageURLs, // 게시글 이미지
      category: data.category, // 전공
      createdAt: data.createdAt.toDate(), // 게시글 작성일
			email: data.email, // 작성한 유저의 email
			userUID: data.userUID, // 작성한 유저의 uid
			photoURL: photoURL // 작성한 유저의 프로필 이미지
    };
  } else {
    throw new Error('게시글을 찾을 수 없습니다.');
  }
}

// 게시글 삭제
export const deletePost = async (postId: string) => {
	try{
		const postRef = doc(db, "posts", postId);
		await deleteDoc(postRef);
	} catch(e) {
		console.log("게시글 삭제 실패 : ", e);
	}
	
}

// 댓글 조회
export const getComments = async ( postId: string ) => {
	// 모든 댓글 조회 쿼리(최근 작성일 순서로 작성)
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
	// 데이터 가지고오기
  const snapshot = await getDocs(q);
  
	const comments = await Promise.all(
		snapshot.docs.map(async (commentDoc) => {
			const data = commentDoc.data();
			console.log("data data : ", data);
			const createdAt = (data.createdAt as Timestamp).toDate();
			const userUID = data.userUID;
			let photoURL = null; // 유저 프로필 이미지
			let userEmail = null; // 유저 이메일

			try{
				if(userUID) {
					const userRef = doc(db, "users", userUID);
					const userSnap = await getDoc(userRef);
					if(userSnap.exists()) {
						const userData = userSnap.data();
						photoURL = userData.photoURL ?? null;
						userEmail = userData.email ?? null;
					}
				}
			} catch(e) {
				console.error("댓글 조회 파트에서 유저 조회에 오류남 : ", e);
			}
		
			return {
				commentId: commentDoc.id, // 댓글 uid
				content: data.content, // 댓글 내용
				userUID: data.userUID, // 댓글 작성자 uid
				createdAt: createdAt, // 댓글 작성일
				email: userEmail, 
				userPhotoURL: photoURL,
			};
		})
	)	
	return comments;
};

// 댓글 추가
export const addComment = async({postId, comment, userUID}:addCommentProps) => {
  try{
    await addDoc(
      collection(db, "posts", postId, "comments"), 
      {
        userUID: userUID,
        content: comment,
        createdAt: Timestamp.now(),
      }
    );
  } catch(error) {
    console.error("Error add comment: ", error)
  }
};

export const deleteComment = async(postId: string, commentId: string) => {
	try {
		const commentRef = doc(db, "posts", postId, "comments", commentId);
		deleteDoc(commentRef);
	} catch(e) {
		console.error("댓글 삭제 실패 : ", e);
	}
}

//게시글 좋아요 기능
export const likePost = async (postId:string, userUID:string) => {
	const likeRef = doc(db, "posts", postId, "likes", userUID);
	const postRef = doc(db, "posts", postId);
	// setDoc: 문서가 있으면 덮어쓰고 없으면 새로 생성한다. 또 문서ID를 직정 정해서 사용하는 경우 사용한다.
	await setDoc(likeRef, {
		likedAt: Timestamp.now(),
	})
	// posts 문서에 likeCount에 +1을 한다.
	await updateDoc(postRef, {
		likeCount: increment(1),
	});
}

//게시글 좋아요 취소 기능
export const unlikePost = async (postId:string, userUID:string) => {
	const likeRef = doc(db, "posts", postId, "likes", userUID);
	const postRef = doc(db, "posts", postId);
	// likes에서 userUID에 해당하는 문서를 삭제한다.
	await deleteDoc(likeRef);
	await updateDoc(postRef, {
		likeCount: increment(-1),
	})

}

// 좋아요 눌렀는지 확인
export const isPostLiked = async (postId:string, userUID:string): Promise<boolean> => {
	const likeRef = doc(db, "posts", postId, "likes", userUID);
	const likSnap = await getDoc(likeRef);
	//존재 여부를 boolean값으로 리턴한다.
	return likSnap.exists();
}

// 좋아요 개수 카운트
export const getLikePostCount = async(postId:string): Promise<number> => {
	const likesRef = collection(db, "posts", postId, "likes");
	const likesSnap = await getDocs(likesRef);

	return likesSnap.size;

}

//인기 글 조회(3개)
export const getPopularPosts = async(): Promise<postProps1[]> => {
	const popularRef = collection(db, "posts");
	const q = query(
		popularRef, 
		orderBy('likeCount', 'desc'),
		limit(3)
	);
	const popularSnap = await getDocs(q);
	return popularSnap.docs.map(
		doc => ({ id:doc.id, ...doc.data() } as postProps1)
	);
}