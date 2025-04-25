import { Timestamp } from "firebase/firestore";

// 게시글 업로드 타입
export interface postProps {
  title: string;
  content: string;
  imageUrls: string[];
  major: string;
  userId: string;
  createdAt: Date;
}