import React from 'react';
import { Box, Container } from '@mui/material';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  searchQuery = '',
  onSearchChange = () => {},
}) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
};
