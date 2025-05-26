import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../services/api';

interface Category {
  id: number;
  name: string;
  description: string;
}

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: categoriesApi.getCategories,
    staleTime: 10 * 60 * 1000, // 10분
  });
};
