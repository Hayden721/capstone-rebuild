import { Timestamp } from "firebase/firestore";

// 게시글 조회 타입
export interface postProps {
  title: string; // 게시글 제목 
  content: string; // 게시글 내용
  imageURLs: string[]; // 게시글 이미지 
  category: string; // 게시글의 카테고리
  userUID: string; // 유저 uid
  createdAt: Date; //게시글 생성일 
  email: string; // 유저 이메일
  photoURL: string; // 유저 프로필 사진
}
// 게시글 업로드 타입
export interface addPostProps {
  title: string; // 제목
  content: string; // 내용
  imageURLs: string[]; // 게시글 이미지
  category: string; // 카테고리
  userUID: string; // 작성한 유저 uid
  email: string; // 유저의 email
}

// 댓글 추가 타입
export interface addCommentProps {
  postId: string, // 댓글 달 게시글의 uid
  comment: string, // 댓글 내용
  userUID: string, // 댓글 작성자 
}
// 댓글 조회 타입
export interface getCommentProps {
  commentId: string; // 댓글 uid
  content: string; // 댓글 내용
  userUID: string; // 댓글 작성자 uid
  createdAt: Date; // 댓글 작성일
  email: string; // 유저 이메일
  userPhotoURL: string; // 유저 프로필 이미지
}

// 채팅방 조회 타입
export interface getChatroomProps {
  admin: string;
  createdAt: Timestamp|Date;
  title: string;
  explain: string;
  imageURL: string|null;
  users: string[];
}

