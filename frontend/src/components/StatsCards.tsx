import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

interface StatsCardsProps {
  totalPosts: number;
  monthlyPosts: number;
  categoriesCount: number;
  totalSummaries: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalPosts,
  monthlyPosts,
  categoriesCount,
  totalSummaries,
}) => {
  const stats = [
    {
      label: '총 문서 수',
      value: totalPosts,
      color: '#2c5aa0',
    },
    {
      label: '이번 달 추가',
      value: monthlyPosts,
      color: '#388e3c',
    },
    {
      label: '카테고리',
      value: categoriesCount,
      color: '#f57c00',
    },
    {
      label: '총 요약 생성',
      value: totalSummaries,
      color: '#7b1fa2',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Card sx={{ textAlign: 'center', py: 1 }}>
            <CardContent>
              <Typography
                variant="h3"
                component="div"
                sx={{
                  fontWeight: 'bold',
                  color: stat.color,
                  mb: 1,
                }}
              >
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
