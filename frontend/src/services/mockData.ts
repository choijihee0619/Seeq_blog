// 타입을 직접 정의
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

interface CreatePostData {
  title: string;
  content: string;
  categoryId: number;
  imageUrl?: string;
}

interface UpdatePostData {
  title: string;
  content: string;
  categoryId: number;
  imageUrl?: string;
  regenerateSummary?: boolean;
}

// 목 카테고리 데이터
export const mockCategories: Category[] = [
  { id: 1, name: '독서', description: '독서 관련 문서' },
  { id: 2, name: '학습', description: '학습 관련 문서' },
  { id: 3, name: '일상', description: '일상 관련 문서' },
  { id: 4, name: '기타', description: '기타 문서' },
];

// 목 게시물 데이터
export const mockPosts: Post[] = [
  {
    id: 1,
    title: '머신러닝 기초 이론 정리',
    content: `# 머신러닝 기초 이론

머신러닝(Machine Learning)은 인공지능의 한 분야로, 컴퓨터가 명시적으로 프로그래밍되지 않고도 데이터로부터 학습할 수 있게 하는 기술입니다.

## 지도학습 (Supervised Learning)

지도학습은 입력과 정답이 쌍으로 이루어진 훈련 데이터를 사용하여 모델을 학습시키는 방법입니다.

### 주요 알고리즘
- **선형회귀**: 연속적인 값을 예측
- **로지스틱회귀**: 이진 분류 문제 해결
- **의사결정트리**: 규칙 기반의 분류 및 회귀
- **랜덤포레스트**: 여러 의사결정트리의 앙상블

## 비지도학습 (Unsupervised Learning)

비지도학습은 정답 레이블이 없는 데이터에서 숨겨진 패턴이나 구조를 찾는 학습 방법입니다.

### 주요 기법
- **클러스터링**: 유사한 데이터끼리 그룹화
- **차원축소**: 고차원 데이터를 저차원으로 변환
- **연관규칙**: 데이터 간의 관계 발견

## 실제 적용 사례

머신러닝은 다양한 분야에서 활용되고 있습니다:

1. **추천 시스템**: 넷플릭스, 아마존 등
2. **이미지 인식**: 자율주행차, 의료 진단
3. **자연어 처리**: 번역, 챗봇, 감정 분석
4. **예측 분석**: 주가 예측, 날씨 예보

머신러닝을 효과적으로 활용하기 위해서는 적절한 데이터 전처리, 모델 선택, 그리고 성능 평가가 중요합니다.`,
    category: mockCategories[1], // 학습
    summary: {
      id: 1,
      postId: 1,
      summary: '머신러닝의 기본 개념과 지도학습, 비지도학습의 차이점을 설명합니다. 주요 알고리즘으로는 선형회귀, 의사결정트리, 클러스터링 등이 있으며, 추천 시스템, 이미지 인식, 자연어 처리 등 다양한 분야에서 활용되고 있습니다.',
      highlights: [
        '지도학습은 정답이 있는 데이터로 학습하는 방법',
        '비지도학습은 패턴을 스스로 찾는 학습 방법',
        '적절한 데이터 전처리와 모델 선택이 핵심',
      ],
      keywords: ['머신러닝', 'AI', '지도학습', '비지도학습', '알고리즘'],
      modelVersion: 'GPT-4.1-nano',
      confidenceScore: 0.94,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    title: '클린 코드 독서 노트',
    content: `# 클린 코드 - 로버트 C. 마틴

좋은 코드를 작성하는 것은 모든 개발자가 추구해야 할 목표입니다. 클린 코드는 읽기 쉽고, 이해하기 쉬우며, 변경하기 쉬운 코드를 의미합니다.

## 의미 있는 이름

### 의도를 분명히 밝히는 이름
변수, 함수, 클래스의 이름은 그 존재 이유와 수행 기능, 사용 방법을 명확히 드러내야 합니다.

**나쁜 예:**
\`\`\`javascript
const d = 30; // 경과 시간(일)
\`\`\`

**좋은 예:**
\`\`\`javascript
const elapsedTimeInDays = 30;
\`\`\`

### 그릇된 정보를 피하라
코드에 그릇된 단서를 남겨서는 안 됩니다. 약어나 줄임말은 피하는 것이 좋습니다.

## 함수

### 작게 만들어라
함수는 가능한 한 작게 만들어야 합니다. 함수의 첫 번째 규칙은 '작게!'이고, 두 번째 규칙은 '더 작게!'입니다.

### 한 가지만 해라
함수는 한 가지를 해야 하고, 그 한 가지를 잘 해야 하며, 그 한 가지만을 해야 합니다.

**나쁜 예:**
\`\`\`javascript
function calc(a, b) {
  return a * b * 0.1;
}
\`\`\`

**좋은 예:**
\`\`\`javascript
function calculateTaxAmount(price, taxRate) {
  return price * taxRate;
}
\`\`\`

## 주석

주석은 코드로 의도를 표현하지 못한 실패를 만회하기 위해 쓰는 것입니다. 주석이 필요한 상황이라면 코드로 의도를 표현할 방법이 없는지 다시 생각해보세요.

### 좋은 주석
- 법적인 주석 (저작권, 라이선스)
- 정보를 제공하는 주석
- 의도를 설명하는 주석
- 결과를 경고하는 주석

### 나쁜 주석
- 중얼거리는 주석
- 같은 이야기를 중복하는 주석
- 오해할 여지가 있는 주석
- 의무적으로 다는 주석

## 마무리

클린 코드는 하루아침에 만들어지지 않습니다. 지속적인 연습과 리팩토링을 통해 점진적으로 개선해나가야 합니다.`,
    category: mockCategories[0], // 독서
    summary: {
      id: 2,
      postId: 2,
      summary: '좋은 코드 작성을 위한 핵심 원칙들을 정리한 내용입니다. 의미 있는 이름 짓기, 함수는 작고 한 가지 일만 하기, 주석보다는 코드로 의도 표현하기 등의 실용적인 조언을 제공합니다.',
      highlights: [
        '함수는 작게 만들고 한 가지 일만 해야 함',
        '변수와 함수는 의도를 명확히 드러내는 이름 사용',
        '주석보다는 코드 자체로 의도를 표현하는 것이 좋음',
      ],
      keywords: ['클린코드', '리팩토링', '코드품질', '함수', '변수명'],
      modelVersion: 'GPT-4.1-nano',
      confidenceScore: 0.91,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
  },
  {
    id: 3,
    title: '오늘의 회의 정리',
    content: `# Q1 프로젝트 회의 정리

**일시**: 2024년 1월 10일 오후 3시  
**참석자**: 김팀장, 이개발자, 박디자이너, 최기획자

## 안건 1: 프로젝트 진행 상황 점검

### 현재 진행률
- **백엔드 개발**: 70% 완료
- **프론트엔드 개발**: 85% 완료  
- **디자인 시스템**: 90% 완료
- **테스팅**: 40% 완료

### 주요 성과
1. 사용자 인증 시스템 완료
2. 데이터베이스 마이그레이션 완료
3. 메인 화면 UI/UX 완성

## 안건 2: 주요 이슈사항

### 이슈 1: API 응답 속도 개선 필요
- **현재 상황**: 평균 응답 시간 2.5초
- **목표**: 1초 이내
- **해결 방안**: 
  - 데이터베이스 인덱스 최적화
  - 캐싱 시스템 도입
  - API 엔드포인트 최적화

### 이슈 2: 모바일 반응형 디자인 수정
- **현재 상황**: 일부 화면에서 레이아웃 깨짐
- **해결 방안**:
  - CSS Grid/Flexbox 재검토
  - 브레이크포인트 재조정
  - 테스트 디바이스 확대

### 이슈 3: 사용자 피드백 수집 방법
- **현재 상황**: 피드백 채널 부족
- **해결 방안**:
  - 인앱 피드백 기능 추가
  - 베타 테스터 그룹 구성
  - 구글 애널리틱스 연동

## 향후 계획

### 1월 3주차 (1/15 - 1/19)
- API 성능 최적화 완료
- 모바일 반응형 수정 완료
- 단위 테스트 작성 (80% 목표)

### 1월 4주차 (1/22 - 1/26)  
- 통합 테스트 진행
- 베타 테스팅 시작
- 배포 준비 (스테이징 환경)

### 2월 1주차 (1/29 - 2/2)
- 베타 피드백 반영
- 최종 QA 테스팅
- 프로덕션 배포

## 결정사항

1. **다음 회의**: 1월 17일 (수) 오후 2시
2. **배포 일정**: 2월 5일 (월) 예정
3. **추가 인력**: UI/UX 디자이너 1명 단기 지원 요청

**회의 종료**: 오후 4시 30분`,
    category: mockCategories[2], // 일상
    summary: {
      id: 3,
      postId: 3,
      summary: 'Q1 프로젝트 진행 상황 점검 및 향후 계획 수립 회의 내용입니다. API 성능, 모바일 반응형, 피드백 수집 등 3가지 주요 이슈와 해결 방안을 논의했으며, 2월 5일 배포를 목표로 일정을 확정했습니다.',
      highlights: [
        'API 응답 속도를 2.5초에서 1초 이내로 개선 필요',
        '2월 5일 프로덕션 배포 일정 확정',
        '베타 테스터 그룹 구성으로 사용자 피드백 수집',
      ],
      keywords: ['프로젝트', '회의', 'API최적화', '배포일정', '이슈해결'],
      modelVersion: 'GPT-4.1-nano',
      confidenceScore: 0.88,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    createdAt: '2024-01-10T16:45:00Z',
    updatedAt: '2024-01-10T16:45:00Z',
  },
];

let nextId = 4;

// 목 API 함수들 (내부 복사본 사용)
const postsData = [...mockPosts];

export const mockApi = {
  // 게시물 목록 조회
  getPosts: async (search?: string, categoryId?: number): Promise<Post[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // 로딩 시뮬레이션
    
    let filteredPosts = [...postsData];
    
    if (search) {
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (categoryId) {
      filteredPosts = filteredPosts.filter(post => post.category.id === categoryId);
    }
    
    return filteredPosts.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // 게시물 상세 조회
  getPost: async (id: number): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const post = postsData.find(p => p.id === id);
    if (!post) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }
    return post;
  },

  // 게시물 생성
  createPost: async (data: CreatePostData): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 2000)); // AI 요약 생성 시뮬레이션
    
    const category = mockCategories.find(c => c.id === data.categoryId);
    if (!category) {
      throw new Error('유효하지 않은 카테고리입니다.');
    }

    const newPost: Post = {
      id: nextId++,
      title: data.title,
      content: data.content,
      category,
      imageUrl: data.imageUrl,
      summary: {
        id: nextId,
        postId: nextId - 1,
        summary: `${data.title}에 대한 AI 생성 요약입니다. 이 문서는 ${category.name} 카테고리에 속하며, 주요 내용을 간결하게 정리했습니다.`,
        highlights: [
          '첫 번째 핵심 포인트',
          '두 번째 중요한 내용',
          '세 번째 주요 개념',
        ],
        keywords: ['키워드1', '키워드2', '키워드3'],
        modelVersion: 'GPT-4.1-nano',
        confidenceScore: 0.89,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    postsData.unshift(newPost);
    return newPost;
  },

  // 게시물 수정
  updatePost: async (id: number, data: UpdatePostData): Promise<Post> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const postIndex = postsData.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }

    const category = mockCategories.find(c => c.id === data.categoryId);
    if (!category) {
      throw new Error('유효하지 않은 카테고리입니다.');
    }

    const updatedPost: Post = {
      ...postsData[postIndex],
      title: data.title,
      content: data.content,
      category,
      imageUrl: data.imageUrl,
      updatedAt: new Date().toISOString(),
    };

    // 요약 재생성이 요청된 경우
    if (data.regenerateSummary) {
      updatedPost.summary = {
        ...updatedPost.summary!,
        summary: `${data.title}에 대한 재생성된 AI 요약입니다. 수정된 내용을 반영하여 새롭게 생성했습니다.`,
        highlights: [
          '수정된 첫 번째 핵심 포인트',
          '업데이트된 두 번째 중요 내용',
          '새로운 세 번째 주요 개념',
        ],
        keywords: ['수정된키워드1', '업데이트키워드2', '새로운키워드3'],
        updatedAt: new Date().toISOString(),
      };
    }

    postsData[postIndex] = updatedPost;
    return updatedPost;
  },

  // 게시물 삭제
  deletePost: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const postIndex = postsData.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new Error('게시물을 찾을 수 없습니다.');
    }

    postsData.splice(postIndex, 1);
  },

  // 카테고리 목록 조회
  getCategories: async (): Promise<Category[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...mockCategories];
  },
};
