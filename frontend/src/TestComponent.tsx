import React from 'react';
import { Post } from './types';

const TestComponent: React.FC = () => {
  const testPost: Post = {
    id: 1,
    title: 'Test',
    content: 'Test content',
    category: { id: 1, name: 'Test', description: 'Test' },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return <div>타입 테스트: {testPost.title}</div>;
};

export default TestComponent;
