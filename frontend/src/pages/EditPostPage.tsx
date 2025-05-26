import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Layout, Loading, ErrorMessage } from '../components';
import { usePost, useUpdatePost, useCategories } from '../hooks';
import { UpdatePostData } from '../types';

export const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = parseInt(id || '0');

  const { data: post, isLoading: postLoading, error: postError } = usePost(postId);
  const { data: categories } = useCategories();
  const updatePostMutation = useUpdatePost();

  const [formData, setFormData] = useState<UpdatePostData>({
    title: '',
    content: '',
    categoryId: 0,
    imageUrl: '',
  });

  const [isRegeneratingSummary, setIsRegeneratingSummary] = useState(false);

  // 폼 데이터 초기화
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
        categoryId: post.category.id,
        imageUrl: post.imageUrl || '',
      });
    }
  }, [post]);

  const handleInputChange = (field: keyof UpdatePostData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleCategoryChange = (event: any) => {
    setFormData(prev => ({
      ...prev,
      categoryId: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.categoryId) {
      alert('제목, 내용, 카테고리를 모두 입력해주세요.');
      return;
    }

    try {
      await updatePostMutation.mutateAsync({ id: postId, data: formData });
      navigate(`/posts/${postId}`);
    } catch (error) {
      alert('문서 수정 중 오류가 발생했습니다.');
    }
  };

  const handleRegenerateSummary = async () => {
    if (!window.confirm('요약을 다시 생성하시겠습니까? 기존 요약이 새로운 요약으로 대체됩니다.')) {
      return;
    }

    try {
      setIsRegeneratingSummary(true);
      await updatePostMutation.mutateAsync({ 
        id: postId, 
        data: { ...formData, regenerateSummary: true } 
      });
      setIsRegeneratingSummary(false);
      alert('요약이 다시 생성되었습니다.');
    } catch (error) {
      setIsRegeneratingSummary(false);
      alert('요약 재생성 중 오류가 발생했습니다.');
    }
  };

  const handleCancel = () => {
    if (post && (
      formData.title !== post.title ||
      formData.content !== post.content ||
      formData.categoryId !== post.category.id ||
      formData.imageUrl !== (post.imageUrl || '')
    )) {
      if (window.confirm('수정 중인 내용이 있습니다. 정말로 취소하시겠습니까?')) {
        navigate(`/posts/${postId}`);
      }
    } else {
      navigate(`/posts/${postId}`);
    }
  };

  if (postLoading) {
    return (
      <Layout>
        <Loading message="문서를 불러오는 중..." />
      </Layout>
    );
  }

  if (postError || !post || !categories) {
    return (
      <Layout>
        <ErrorMessage
          title="문서를 찾을 수 없습니다"
          message="요청하신 문서가 존재하지 않거나 삭제되었습니다."
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <Box component="form" onSubmit={handleSubmit}>
        {/* 헤더 섹션 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ fontWeight: 'bold', color: '#2c5aa0' }}
          >
            ✏️ 문서 수정
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={updatePostMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="outlined"
              startIcon={isRegeneratingSummary ? <CircularProgress size={20} /> : <RefreshIcon />}
              onClick={handleRegenerateSummary}
              disabled={updatePostMutation.isPending || isRegeneratingSummary}
              sx={{ color: '#f57c00', borderColor: '#f57c00' }}
            >
              {isRegeneratingSummary ? '요약 생성 중...' : '요약 재생성'}
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={updatePostMutation.isPending ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={updatePostMutation.isPending}
              sx={{ backgroundColor: '#2c5aa0' }}
            >
              {updatePostMutation.isPending ? '저장 중...' : '수정 저장'}
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* 메인 입력 폼 */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="📝 문서 제목"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    required
                    disabled={updatePostMutation.isPending}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>🏷️ 카테고리</InputLabel>
                    <Select
                      value={formData.categoryId}
                      onChange={handleCategoryChange}
                      label="🏷️ 카테고리"
                      disabled={updatePostMutation.isPending}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name === '독서' && '📖 '}
                          {category.name === '학습' && '🎓 '}
                          {category.name === '일상' && '📝 '}
                          {category.name === '기타' && '📋 '}
                          {category.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="🖼️ 대표 이미지 URL (선택)"
                    value={formData.imageUrl}
                    onChange={handleInputChange('imageUrl')}
                    disabled={updatePostMutation.isPending}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="📄 원본 내용"
                    value={formData.content}
                    onChange={handleInputChange('content')}
                    multiline
                    rows={15}
                    required
                    disabled={updatePostMutation.isPending}
                    sx={{
                      '& .MuiInputBase-input': {
                        lineHeight: 1.6,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 사이드 정보 */}
          <Grid item xs={12} md={4}>
            {/* 현재 요약 정보 */}
            {post.summary && (
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#e8f0fe', border: '2px solid #2c5aa0' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#2c5aa0' }}>
                  🤖 현재 AI 요약
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                  {post.summary.summary}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'text.secondary' }}>
                  <span>신뢰도: {Math.round((post.summary.confidenceScore || 0) * 100)}%</span>
                  <span>키워드: {post.summary.keywords?.length || 0}개</span>
                </Box>
              </Paper>
            )}

            {/* 수정 안내 */}
            <Paper sx={{ p: 3, backgroundColor: '#fff3cd', border: '2px solid #ffc107' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#856404' }}>
                ⚠️ 수정 안내
              </Typography>
              <Typography variant="body2" sx={{ color: '#856404', mb: 2 }}>
                내용을 수정하신 후 '수정 저장'을 클릭하면 기존 요약이 유지됩니다.
              </Typography>
              <Typography variant="body2" sx={{ color: '#856404' }}>
                새로운 요약이 필요하시면 '요약 재생성' 버튼을 먼저 클릭해주세요.
              </Typography>
            </Paper>

            {/* 문서 정보 */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#2c5aa0' }}>
                📊 문서 정보
              </Typography>
              <Box sx={{ '& > div': { display: 'flex', justifyContent: 'space-between', mb: 1 } }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">작성일:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">수정일:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {new Date(post.updatedAt).toLocaleDateString('ko-KR')}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">문자 수:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {formData.content.length.toLocaleString()}자
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* 에러 메시지 */}
        {updatePostMutation.error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            문서 수정 중 오류가 발생했습니다. 다시 시도해주세요.
          </Alert>
        )}
      </Box>
    </Layout>
  );
};
