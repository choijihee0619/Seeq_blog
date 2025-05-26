// 카테고리 타입
export interface Category {
  id: number;
  name: string;
  description: string;
}

// 요약 타입
export interface Summary {
  id: number;
  postId: number;
  summary: string;
  highlights: string[];
  keywords: string[];
  modelVersion: string;
  confidenceScore: number;
  createdAt: string;
  updatedAt: string;
}

// 게시물 타입
export interface Post {
  id: number;
  title: string;
  content: string;
  category: Category;
  imageUrl?: string;
  summary?: Summary;
  createdAt: string;
  updatedAt: string;
}

// 게시물 생성 데이터 타입
export interface CreatePostData {
  title: string;
  content: string;
  categoryId: number;
  imageUrl?: string; 
}

// 게시물 수정 데이터 타입
export interface UpdatePostData {
  title: string;
  content: string;
  categoryId: number;
  imageUrl?: string;
  regenerateSummary?: boolean;
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
