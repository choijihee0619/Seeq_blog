import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = '오류가 발생했습니다',
  message,
  onRetry,
}) => {
  return (
    <Box sx={{ py: 4 }}>
      <Alert 
        severity="error" 
        action={
          onRetry && (
            <button onClick={onRetry} style={{ textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              다시 시도
            </button>
          )
        }
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
};
