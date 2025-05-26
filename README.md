# 📚 SeeQ LLM 요약 블로그

## 프로젝트 개요
SeeQ는 스마트 안경 기반 AI 정보 요약·검색 서비스입니다. 
Phase 1에서는 웹 기반 LLM 요약 블로그를 구현합니다.

## 기술 스택
- **Backend**: FastAPI, SQLAlchemy, MySQL
- **AI**: OpenAI GPT-4.1-nano
- **Frontend**: React (향후 구현)
- **Database**: MySQL
- **Deployment**: 향후 결정

## 주요 기능
- 📝 텍스트 입력 시 자동 AI 요약 생성
- 🏷️ 카테고리별 문서 관리
- 🔍 검색 및 필터링
- ✨ 하이라이트 및 키워드 추출
- 📊 문서 통계 및 분석

## 개발 환경 설정

### 1. 저장소 클론
```bash
git clone <repository-url>
cd seeq-blog
```

### 2. Python 가상환경 설정
```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
# 또는
venv\Scripts\activate     # Windows
```

### 3. 패키지 설치
```bash
pip install -r requirements.txt
```

### 4. 환경변수 설정
`.env` 파일을 생성하고 다음 내용을 입력:
```bash
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/seeq_blog
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your-secret-key-here
```

### 5. 데이터베이스 설정
```bash
# MySQL 데이터베이스 생성
mysql -u root -p
CREATE DATABASE seeq_blog;
```

### 6. 서버 실행
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## API 문서
서버 실행 후 다음 URL에서 API 문서 확인:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 개발 진행 상황
- [x] Step 1: 환경 설정 및 기본 구조
- [ ] Step 2: 데이터베이스 설계 및 연결
- [ ] Step 3: FastAPI 기본 구조
- [ ] Step 4: OpenAI API 연동
- [ ] Step 5: 핵심 API 구현
- [ ] Step 6: 테스트 및 더미 데이터
- [ ] Step 7: React 프론트엔드

## 라이선스
MIT License