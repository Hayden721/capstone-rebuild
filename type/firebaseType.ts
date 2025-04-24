// 게시글 업로드 타입
export interface fetchPostProps {
  title: string;
  content: string;
  imageUrls: string[];
  major: string;
  userId: string;
}