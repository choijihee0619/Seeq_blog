import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Grid } from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { Layout, Loading, ErrorMessage } from '../components';
import { useCreatePost, useCategories } from '../hooks';
import type { CreatePostData } from '../types';  // 이 경로에 타입이 실제로 export되어 있어야 함!

export const CreatePostPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const createPostMutation = useCreatePost();

  // CreatePostData 타입에 맞춰 초기값 선언
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    content: '',
    categoryId: 0,
    imageUrl: '',
  });

  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  const handleInputChange = (field: keyof CreatePostData) => (
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
      setIsGeneratingSummary(true);
      const result = await createPostMutation.mutateAsync(formData);
      navigate(`/posts/${result.id}`);
    } catch (error) {
      alert('문서 생성 중 오류가 발생했습니다.');
      setIsGeneratingSummary(false);
    }
  };

  const handleCancel = () => {
    if (formData.title || formData.content) {
      if (window.confirm('작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?')) {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  if (!categories) {
    return (
      <Layout>
        <Loading message="카테고리를 불러오는 중..." />
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
            ➕ 새 문서 작성
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={createPostMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={isGeneratingSummary ? <CircularProgress size={20} /> : <SaveIcon />}
              disabled={createPostMutation.isPending}
              sx={{ backgroundColor: '#2c5aa0' }}
            >
              {isGeneratingSummary ? '요약 생성 중...' : '저장 및 요약 생성'}
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
                    placeholder="예: React 고급 패턴 학습 노트"
                    required
                    disabled={createPostMutation.isPending}
                  />
                </Grid>

                <Grid component="div" item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>🏷️ 카테고리</InputLabel>
                    <Select
                      value={formData.categoryId}
                      onChange={handleCategoryChange}
                      label="🏷️ 카테고리"
                      disabled={createPostMutation.isPending}
                    >
                      <MenuItem value={0} disabled>
                        카테고리 선택
                      </MenuItem>
                      {categories.map((category: any) => (
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
                    placeholder="https://example.com/image.jpg"
                    disabled={createPostMutation.isPending}
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
                    placeholder={`여기에 요약하고 싶은 원본 텍스트를 입력하세요.

예시:
- 책의 챕터 내용
- 강의 노트
- 회의 내용
- 연구 자료
- 개인적인 생각이나 아이디어

입력하신 내용은 AI가 자동으로 요약하고 핵심 포인트를 추출합니다.`}
                    required
                    disabled={createPostMutation.isPending}
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
            <Paper sx={{ p: 3, backgroundColor: '#e8f0fe', border: '2px solid #2c5aa0' }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#2c5aa0' }}>
                🤖 AI 요약 미리보기
              </Typography>
              
              {createPostMutation.isPending ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CircularProgress sx={{ color: '#2c5aa0', mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    AI가 요약을 생성하고 있습니다...<br />
                    잠시만 기다려주세요.
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                  내용을 입력하고 '저장 및 요약 생성' 버튼을 클릭하면<br />
                  AI가 자동으로 요약과 하이라이트를 생성합니다.
                </Typography>
              )}
            </Paper>

            {/* 작성 가이드 */}
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#2c5aa0' }}>
                📝 작성 가이드
              </Typography>
              <Box sx={{ '& > div': { mb: 2 } }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  💡 효과적인 요약을 위한 팁:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    명확하고 구체적인 내용 작성
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    단락별로 주제를 구분
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    핵심 키워드 포함
                  </Typography>
                  <Typography component="li" variant="body2">
                    최소 200자 이상 권장
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                  🎯 AI가 생성하는 내용:
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    3-5줄의 간결한 요약
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    3-5개의 핵심 하이라이트
                  </Typography>
                  <Typography component="li" variant="body2">
                    주요 키워드 추출
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* 에러 메시지 */}
        {createPostMutation.error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            문서 생성 중 오류가 발생했습니다. 다시 시도해주세요.
          </Alert>
        )}
      </Box>
    </Layout>
  );
};
