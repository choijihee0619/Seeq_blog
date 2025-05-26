import { mockApi } from './mockData';

// 현재는 목 데이터만 사용 (백엔드 연결시 실제 API로 교체)
export const postsApi = {
  getPosts: mockApi.getPosts,
  getPost: mockApi.getPost,
  createPost: mockApi.createPost,
  updatePost: mockApi.updatePost,
  deletePost: mockApi.deletePost,
};

export const categoriesApi = {
  getCategories: mockApi.getCategories,
};

export default mockApi;
