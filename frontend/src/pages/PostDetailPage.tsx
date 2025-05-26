import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Grid,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Star as StarIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import { Layout, Loading, ErrorMessage } from '../components';
import { usePost, useDeletePost } from '../hooks';

const getCategoryEmoji = (categoryName: string) => {
  switch (categoryName) {
    case '독서': return '📖';
    case '학습': return '🎓';
    case '일상': return '📝';
    case '기타': return '📋';
    default: return '📚';
  }
};

const getCategoryColor = (categoryName: string) => {
  switch (categoryName) {
    case '독서': return '#1976d2';
    case '학습': return '#388e3c';
    case '일상': return '#f57c00';
    case '기타': return '#7b1fa2';
    default: return '#666';
  }
};

export const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = parseInt(id || '0');

  const { data: post, isLoading, error } = usePost(postId);
  const deletePostMutation = useDeletePost();

  const handleEdit = () => {
    navigate(`/posts/${postId}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('정말로 이 문서를 삭제하시겠습니까?')) {
      try {
        await deletePostMutation.mutateAsync(postId);
        navigate('/');
      } catch (error) {
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  if (isLoading) {
    return (
      <Layout>
        <Loading message="문서를 불러오는 중..." />
      </Layout>
    );
  }

  if (error || !post) {
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
      {/* 헤더 섹션 */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              sx={{ fontWeight: 'bold', color: '#2c5aa0' }}
            >
              {post.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label={`${getCategoryEmoji(post.category.name)} ${post.category.name}`}
                sx={{
                  backgroundColor: getCategoryColor(post.category.name),
                  color: 'white',
                  fontWeight: 'bold',
                }}
              />
              <Typography variant="body2" color="text.secondary">
                작성일: {format(new Date(post.createdAt), 'yyyy년 MM월 dd일', { locale: ko })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <ViewIcon sx={{ fontSize: 16, mr: 0.5 }} />
                조회수: 47
              </Typography>
              {post.updatedAt !== post.createdAt && (
                <Typography variant="body2" color="text.secondary">
                  수정일: {format(new Date(post.updatedAt), 'yyyy년 MM월 dd일', { locale: ko })}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            <Button
              variant="outlined"
              startIcon={<StarIcon />}
              sx={{ color: '#2c5aa0', borderColor: '#2c5aa0' }}
            >
              즐겨찾기
            </Button>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{ color: '#666', borderColor: '#666' }}
            >
              수정
            </Button>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={deletePostMutation.isPending}
              sx={{ color: '#d32f2f', borderColor: '#d32f2f' }}
            >
              삭제
            </Button>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={handleHome}
              sx={{ backgroundColor: '#2c5aa0' }}
            >
              목록으로
            </Button>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* 메인 콘텐츠 */}
        <Grid item xs={12} md={8}>
          {/* AI 요약 섹션 */}
          {post.summary && (
            <Paper sx={{ p: 3, mb: 4, backgroundColor: '#e8f0fe', border: '2px solid #2c5aa0' }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ fontWeight: 'bold', color: '#2c5aa0', display: 'flex', alignItems: 'center' }}
              >
                🤖 AI 생성 요약
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  📖 주요 내용:
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {post.summary.summary}
                </Typography>
              </Box>

              {post.summary.highlights && post.summary.highlights.length > 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    🎯 핵심 포인트:
                  </Typography>
                  <Box component="ul" sx={{ pl: 2 }}>
                    {post.summary.highlights.map((highlight, index) => (
                      <Typography component="li" key={index} variant="body1" sx={{ mb: 0.5 }}>
                        {highlight}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          )}

          {/* 원본 내용 섹션 */}
          <Paper sx={{ p: 3 }}>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ fontWeight: 'bold', color: '#2c5aa0', mb: 3 }}
            >
              📝 원본 내용
            </Typography>
            <Box sx={{ 
              '& p': { marginBottom: 2 },
              '& h1, & h2, & h3, & h4, & h5, & h6': { 
                color: '#2c5aa0', 
                fontWeight: 'bold',
                marginTop: 2,
                marginBottom: 1 
              },
              '& ul, & ol': { paddingLeft: 2 },
              '& li': { marginBottom: 0.5 },
              '& blockquote': {
                borderLeft: '4px solid #2c5aa0',
                paddingLeft: 2,
                marginLeft: 0,
                fontStyle: 'italic',
                backgroundColor: '#f5f7fa',
                padding: 2,
                borderRadius: 1
              },
              '& code': {
                backgroundColor: '#f5f7fa',
                padding: '2px 4px',
                borderRadius: 1,
                fontFamily: 'monospace'
              },
              '& pre': {
                backgroundColor: '#f5f7fa',
                padding: 2,
                borderRadius: 1,
                overflow: 'auto'
              }
            }}>
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </Box>
          </Paper>
        </Grid>

        {/* 사이드바 */}
        <Grid item xs={12} md={4}>
          {/* 하이라이트 */}
          {post.summary?.highlights && post.summary.highlights.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#2c5aa0' }}>
                  ✨ 하이라이트
                </Typography>
                {post.summary.highlights.map((highlight, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: '#fff3cd',
                      border: '2px dashed #ffc107',
                      borderRadius: 1,
                      padding: 1.5,
                      mb: 1.5,
                    }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      💡 핵심 {index + 1}
                    </Typography>
                    <Typography variant="body2">
                      {highlight}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {/* 키워드 태그 */}
          {post.summary?.keywords && post.summary.keywords.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#2c5aa0' }}>
                  🏷️ 키워드
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {post.summary.keywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={`#${keyword}`}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        borderColor: '#2c5aa0',
                        color: '#2c5aa0',
                        '&:hover': {
                          backgroundColor: 'rgba(44, 90, 160, 0.1)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* 문서 정보 */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#2c5aa0' }}>
                �� 문서 정보
              </Typography>
              <Box sx={{ '& > div': { display: 'flex', justifyContent: 'space-between', mb: 1 } }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">원본 길이:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {post.content.length.toLocaleString()}자
                  </Typography>
                </Box>
                {post.summary && (
                  <>
                    <Box>
                      <Typography variant="body2" color="text.secondary">요약 비율:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {Math.round((post.summary.summary.length / post.content.length) * 100)}% 
                        ({post.summary.summary.length}자)
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">하이라이트:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {post.summary.highlights?.length || 0}개
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">키워드:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {post.summary.keywords?.length || 0}개
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">LLM 모델:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {post.summary.modelVersion}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">신뢰도:</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {Math.round((post.summary.confidenceScore || 0) * 100)}%
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
};
