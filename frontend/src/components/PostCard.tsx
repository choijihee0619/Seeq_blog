import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Box,
  Button,
  CardActions,
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Visibility as ViewIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 타입 import 수정
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

interface PostCardProps {
  post: Post;
}

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

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/posts/${post.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/posts/${post.id}/edit`);
  };

  const truncateSummary = (summary: string, maxLength: number = 150) => {
    if (summary.length <= maxLength) return summary;
    return summary.substring(0, maxLength) + '...';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
      onClick={handleView}
    >
      {post.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={post.imageUrl}
          alt={post.title}
        />
      )}
      {!post.imageUrl && (
        <Box
          sx={{
            height: 120,
            backgroundColor: '#e0e6ed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666',
            fontSize: '14px',
          }}
        >
          📊 대표 이미지 영역
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          gutterBottom
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 'bold',
            color: '#2c5aa0',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {post.title}
        </Typography>

        {post.summary && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
              �� AI 요약:
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                lineHeight: 1.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {truncateSummary(post.summary.summary)}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip
            label={`${getCategoryEmoji(post.category.name)} ${post.category.name}`}
            size="small"
            sx={{
              backgroundColor: getCategoryColor(post.category.name),
              color: 'white',
              fontWeight: 'bold',
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {format(new Date(post.createdAt), 'yyyy-MM-dd', { locale: ko })}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Button
          size="small"
          startIcon={<ViewIcon />}
          onClick={handleView}
          sx={{ color: '#2c5aa0' }}
        >
          자세히 보기
        </Button>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={handleEdit}
          sx={{ color: '#666' }}
        >
          수정
        </Button>
      </CardActions>
    </Card>
  );
};
