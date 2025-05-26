import React, { useState } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useCategories } from '../hooks/useCategories';
import { usePosts } from '../hooks/usePosts';
import { useDebounce } from '../hooks/useDebounce';
import PostCard from './PostCard';
import CreatePostDialog from './CreatePostDialog';

const DemoApp: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: postsData, isLoading: postsLoading, error: postsError } = usePosts({
    search: debouncedSearch || undefined,
  });

  return (
    <Box>
      {/* Header */}
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ fontWeight: 700, flexGrow: 1 }}>
            📚 SeeQ - AI 요약 블로그
          </Typography>
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setCreateDialogOpen(true)}
            sx={{
              borderColor: 'white',
              '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' },
            }}
          >
            새 문서
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* 상태 정보 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 700 }}>
                  {postsData?.total || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  총 문서 수
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="secondary" sx={{ fontWeight: 700 }}>
                  {categories?.length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  카테고리
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>
                  {postsData?.data.filter(p => p.summary).length || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  AI 요약 완료
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" sx={{ color: '#4caf50', fontWeight: 700 }}>
                  ✅
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  시스템 상태
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 검색 */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder="문서 제목으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ maxWidth: 400 }}
          />
        </Box>

        {/* 카테고리 정보 */}
        {categoriesLoading ? (
          <Alert severity="info">카테고리 로딩 중...</Alert>
        ) : categories && categories.length > 0 ? (
          <Alert severity="success" sx={{ mb: 3 }}>
            ✅ 카테고리 {categories.length}개 로드 완료: {categories.map(c => c.name).join(', ')}
          </Alert>
        ) : (
          <Alert severity="warning" sx={{ mb: 3 }}>
            ⚠️ 백엔드 서버가 실행되지 않아 실제 데이터를 불러올 수 없습니다. (정상 상태)
          </Alert>
        )}

        {/* 게시물 목록 */}
        {postsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : postsError ? (
          <Alert severity="info" sx={{ mt: 3 }}>
            🔧 백엔드 연결 대기 중... (현재는 UI 테스트 모드)
            <br />
            API 서버 실행 시 실제 데이터가 표시됩니다.
          </Alert>
        ) : postsData?.data.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              📝 아직 작성된 문서가 없습니다
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              첫 번째 문서를 작성하고 AI 요약을 경험해보세요!
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => setCreateDialogOpen(true)}
            >
              첫 문서 작성하기
            </Button>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {postsData?.data.map((post) => (
              <Grid item xs={12} md={6} lg={4} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* 새 문서 작성 다이얼로그 */}
      <CreatePostDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
      />
    </Box>
  );
};

export default DemoApp;
