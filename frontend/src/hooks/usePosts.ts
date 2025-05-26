import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../services/api';

// 타입을 직접 정의
interface Category {
  id: number;
  name: string;
  description: string;
}

interface Summary {
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

interface Post {
  id: number;
  title: string;
  content: string;
  category: Category;
  imageUrl?: string;
  summary?: Summary;
  createdAt: string;
  updatedAt: string;
}

interface CreatePostData {
  title: string;
  content: string;
  categoryId: number;
  imageUrl?: string;
}

interface UpdatePostData {
  title: string;
  content: string;
  categoryId: number;
  imageUrl?: string;
  regenerateSummary?: boolean;
}

export const usePosts = (searchQuery?: string, categoryId?: number) => {
  return useQuery({
    queryKey: ['posts', searchQuery, categoryId],
    queryFn: () => postsApi.getPosts(searchQuery, categoryId),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

export const usePost = (id: number) => {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postsApi.getPost(id),
    enabled: !!id,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreatePostData) => postsApi.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePostData }) =>
      postsApi.updatePost(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => postsApi.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
