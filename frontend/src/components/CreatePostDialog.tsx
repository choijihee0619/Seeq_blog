import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useCategories } from '../hooks/useCategories';
import { useCreatePost } from '../hooks/usePosts';
import { PostCreate } from '../types';

interface CreatePostDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ open, onClose }) => {
  const { data: categories } = useCategories();
  const createPostMutation = useCreatePost();

  const [formData, setFormData] = useState<PostCreate>({
    title: '',
    content: '',
    category_id: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.category_id) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      await createPostMutation.mutateAsync(formData);
      setFormData({ title: '', content: '', category_id: 0 });
      onClose();
    } catch (error) {
      console.error('게시물 생성 실패:', error);
    }
  };

  const handleInputChange = (field: keyof PostCreate) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const getCategoryIcon = (categoryName: string): string => {
    const iconMap: { [key: string]: string } = {
      '독서': '📖',
      '학습': '🎓',
      '일상': '📝',
      '기타': '📋',
    };
    return iconMap[categoryName] || '📄';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>➕ 새 문서 작성</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="📝 문서 제목"
                value={formData.title}
                onChange={handleInputChange('title')}
                placeholder="예: React 고급 패턴 학습 노트"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>🏷️ 카테고리</InputLabel>
                <Select
                  value={formData.category_id}
                  onChange={handleInputChange('category_id')}
                  label="🏷️ 카테고리"
                >
                  <MenuItem value={0}>카테고리 선택</MenuItem>
                  {categories?.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {getCategoryIcon(category.name)} {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={8}
                label="📄 원본 내용"
                value={formData.content}
                onChange={handleInputChange('content')}
                placeholder="여기에 요약하고 싶은 원본 텍스트를 입력하세요."
              />
            </Grid>
          </Grid>
        </form>

        {!categories && (
          <Alert severity="info" sx={{ mt: 2 }}>
            💡 백엔드 서버 연결 시 실제 카테고리가 표시됩니다.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={createPostMutation.isPending}
          startIcon={createPostMutation.isPending ? <CircularProgress size={16} /> : null}
        >
          {createPostMutation.isPending ? '생성 중...' : '저장 및 AI 요약 생성'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePostDialog;
