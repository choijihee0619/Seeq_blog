import React, { useState, useMemo } from 'react';
import { Grid, Typography, Box, Pagination } from '@mui/material';
import { Layout, PostCard, FilterChips, StatsCards, Loading, ErrorMessage } from '../components';
import { usePosts, useCategories, useDebounce } from '../hooks';

const POSTS_PER_PAGE = 9;

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts(
    debouncedSearchQuery || undefined,
    selectedCategoryId || undefined
  );

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // 페이지네이션 계산
  const paginatedPosts = useMemo(() => {
    if (!posts) return [];
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    return posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [posts, currentPage]);

  const totalPages = Math.ceil((posts?.length || 0) / POSTS_PER_PAGE);

  // 카테고리별 게시물 수 계산
  const postCounts = useMemo(() => {
    if (!posts || !categories) return {};
    
    const counts: Record<number, number> = {};
    categories.forEach(category => {
      counts[category.id] = posts.filter(post => post.category.id === category.id).length;
    });
    return counts;
  }, [posts, categories]);

  // 통계 데이터 계산
  const statsData = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    const monthlyPosts = posts?.filter(post => {
      const postDate = new Date(post.createdAt);
      return postDate.getMonth() === currentMonth && postDate.getFullYear() === currentYear;
    }).length || 0;

    return {
      totalPosts: posts?.length || 0,
      monthlyPosts,
      categoriesCount: categories?.length || 0,
      totalSummaries: posts?.filter(post => post.summary).length || 0,
    };
  }, [posts, categories]);

  // 검색 결과 메시지
  const getSearchResultMessage = () => {
    if (!debouncedSearchQuery && selectedCategoryId === null) return null;
    
    const categoryName = selectedCategoryId 
      ? categories?.find(c => c.id === selectedCategoryId)?.name 
      : null;
    
    if (debouncedSearchQuery && categoryName) {
      return `"${debouncedSearchQuery}" 검색 결과 (${categoryName} 카테고리)`;
    } else if (debouncedSearchQuery) {
      return `"${debouncedSearchQuery}" 검색 결과`;
    } else if (categoryName) {
      return `${categoryName} 카테고리`;
    }
    return null;
  };

  // 페이지 변경 처리
  const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 카테고리 선택 처리
  const handleCategorySelect = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1); // 첫 페이지로 리셋
  };

  // 검색어 변경 처리
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // 첫 페이지로 리셋
  };

  if (postsLoading || categoriesLoading) {
    return (
      <Layout searchQuery={searchQuery} onSearchChange={handleSearchChange}>
        <Loading message="문서를 불러오는 중..." />
      </Layout>
    );
  }

  if (postsError) {
    return (
      <Layout searchQuery={searchQuery} onSearchChange={handleSearchChange}>
        <ErrorMessage
          title="문서 로딩 실패"
          message="문서를 불러오는데 실패했습니다. 네트워크 연결을 확인해주세요."
        />
      </Layout>
    );
  }

  return (
    <Layout searchQuery={searchQuery} onSearchChange={handleSearchChange}>
      {/* 헤더 섹션 */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          sx={{ fontWeight: 'bold', color: '#2c5aa0' }}
        >
          📚 SeeQ 요약 블로그
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          AI가 생성한 요약과 하이라이트로 효율적인 정보 관리
        </Typography>
      </Box>

      {/* 통계 카드 */}
      <StatsCards {...statsData} />

      {/* 필터 칩 */}
      {categories && (
        <FilterChips
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={handleCategorySelect}
          postCounts={postCounts}
        />
      )}

      {/* 검색/필터 결과 표시 */}
      {getSearchResultMessage() && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#2c5aa0' }}>
            {getSearchResultMessage()} ({posts?.length || 0}개)
          </Typography>
        </Box>
      )}

      {/* 게시물 없음 메시지 */}
      {posts && posts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            📄 문서가 없습니다
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {debouncedSearchQuery || selectedCategoryId 
              ? '검색 조건에 맞는 문서를 찾을 수 없습니다.'
              : '첫 번째 문서를 작성해보세요!'
            }
          </Typography>
        </Box>
      )}

      {/* 게시물 그리드 */}
      {paginatedPosts.length > 0 && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {paginatedPosts.map((post) => (
              <Grid item xs={12} sm={6} lg={4} key={post.id}>
                <PostCard post={post} />
              </Grid>
            ))}
          </Grid>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Layout>
  );
};
