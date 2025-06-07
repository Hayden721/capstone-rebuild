import { Timestamp } from "firebase/firestore";


// 게시글 조회 타입
export interface postProps {
  title: string;
  content: string;
  imageUrls: string[];
  major: string;
  userId: string;
  createdAt: Date;
}
// 게시글 업로드 타입
export interface postUploadProps {
  title: string;
  content: string;
  imageURLs: string[];
  category: string;
  userUID: string;
  email: string;
}


// 댓글 추가 타입
export interface commentProps {
  major: string,
  postId: string,
  comment: string,
  userId: string,
}
// 댓글 조회 타입
export interface getCommentProps {
  commentId: string;
  content: string;
  userId: string;
  createdAt: Date;
}

export interface getChatroomProps {
  id: string;
  title: string;
  explain: string;
  imageURL: string|null;
  createdAt: Timestamp|Date;
}