import React from 'react';
import { Box, Chip } from '@mui/material';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface FilterChipsProps {
  categories: Category[];
  selectedCategoryId: number | null;
  onCategorySelect: (categoryId: number | null) => void;
  postCounts?: Record<number, number>;
}

const getCategoryEmoji = (categoryName: string) => {
  switch (categoryName) {
    case '독서': return '📖';
    case '학습': return '🎓';
    case '일상': return '��';
    case '기타': return '📋';
    default: return '📚';
  }
};

export const FilterChips: React.FC<FilterChipsProps> = ({
  categories,
  selectedCategoryId,
  onCategorySelect,
  postCounts = {},
}) => {
  const totalCount = Object.values(postCounts).reduce((sum, count) => sum + count, 0);

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <Chip
        label={`📚 전체 (${totalCount})`}
        onClick={() => onCategorySelect(null)}
        variant={selectedCategoryId === null ? 'filled' : 'outlined'}
        sx={{
          backgroundColor: selectedCategoryId === null ? '#2c5aa0' : 'transparent',
          color: selectedCategoryId === null ? 'white' : '#2c5aa0',
          borderColor: '#2c5aa0',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: selectedCategoryId === null ? '#1e3f73' : 'rgba(44, 90, 160, 0.1)',
          },
        }}
      />
      {categories.map((category) => (
        <Chip
          key={category.id}
          label={`${getCategoryEmoji(category.name)} ${category.name} (${postCounts[category.id] || 0})`}
          onClick={() => onCategorySelect(category.id)}
          variant={selectedCategoryId === category.id ? 'filled' : 'outlined'}
          sx={{
            backgroundColor: selectedCategoryId === category.id ? '#2c5aa0' : 'transparent',
            color: selectedCategoryId === category.id ? 'white' : '#2c5aa0',
            borderColor: '#2c5aa0',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: selectedCategoryId === category.id ? '#1e3f73' : 'rgba(44, 90, 160, 0.1)',
            },
          }}
        />
      ))}
    </Box>
  );
};
