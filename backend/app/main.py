# backend/app/main.py

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError
from app.core.database import engine, get_db
from app.models import category, post, summary  # 모든 모델 import
from app.api import posts, categories
from app.core.config import settings
from app.schemas import HealthCheck
from datetime import datetime
import logging

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI 앱 생성
app = FastAPI(
    title="SeeQ LLM 요약 블로그 API",
    description="SeeQ 프로젝트의 LLM 기반 자동 요약 블로그 시스템",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # React 개발 서버
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터베이스 테이블 생성
@app.on_event("startup")
async def startup_event():
    """앱 시작시 실행되는 이벤트"""
    try:
        # 데이터베이스 테이블 생성
        logger.info("데이터베이스 테이블 생성 중...")
        category.Base.metadata.create_all(bind=engine)
        post.Base.metadata.create_all(bind=engine)
        summary.Base.metadata.create_all(bind=engine)
        logger.info("데이터베이스 테이블 생성 완료")
        
        # OpenAI API 설정 확인
        if not settings.OPENAI_API_KEY:
            logger.warning("OpenAI API 키가 설정되지 않았습니다!")
        else:
            logger.info("OpenAI API 키 설정 확인 완료")
            
    except Exception as e:
        logger.error(f"앱 시작 중 오류 발생: {str(e)}")

# API 라우터 등록
app.include_router(posts.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")

# 헬스체크 엔드포인트
@app.get("/health", response_model=HealthCheck)
async def health_check():
    """시스템 상태 확인"""
    try:
        # 데이터베이스 연결 확인
        db = next(get_db())
        db.execute("SELECT 1")
        db_status = "connected"
        
    except SQLAlchemyError:
        db_status = "disconnected"
        raise HTTPException(status_code=503, detail="데이터베이스 연결 실패")
    
    # OpenAI API 키 확인
    openai_status = "configured" if settings.OPENAI_API_KEY else "not_configured"
    
    return HealthCheck(
        status="healthy",
        timestamp=datetime.now(),
        database=db_status,
        openai=openai_status
    )

# 루트 엔드포인트
@app.get("/")
async def root():
    """API 정보"""
    return {
        "message": "SeeQ LLM 요약 블로그 API",
        "version": "1.0.0",
        "features": [
            "게시물 CRUD",
            "LLM 자동 요약",
            "하이라이트 추출",
            "키워드 추출",
            "카테고리 관리",
            "검색 및 필터링"
        ],
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )