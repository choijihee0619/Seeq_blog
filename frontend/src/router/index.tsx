import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage, PostDetailPage, CreatePostPage, EditPostPage } from '../pages';

// 에러 페이지 컴포넌트
const ErrorPage: React.FC = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{ color: '#2c5aa0', marginBottom: '16px' }}>🚫 페이지를 찾을 수 없습니다</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <a 
        href="/" 
        style={{ 
          color: '#2c5aa0', 
          textDecoration: 'none',
          padding: '12px 24px',
          border: '2px solid #2c5aa0',
          borderRadius: '8px',
          fontWeight: 'bold'
        }}
      >
        🏠 홈으로 돌아가기
      </a>
    </div>
  );
};

// 라우터 설정
const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/posts/:id',
    element: <PostDetailPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/posts/:id/edit',
    element: <EditPostPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/create',
    element: <CreatePostPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
