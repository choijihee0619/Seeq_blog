from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import logging

from .config import settings

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# SQLAlchemy 엔진 생성
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,  # 연결 상태 확인
    pool_recycle=300,    # 5분마다 연결 재사용
    echo=settings.DEBUG,  # 개발 환경에서 SQL 쿼리 로깅
)

# 세션 팩토리 생성
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# 모델 베이스 클래스
Base = declarative_base()

def get_db() -> Generator[Session, None, None]:
    """
    데이터베이스 세션 의존성
    FastAPI 의존성 주입에서 사용
    """
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        logger.error(f"Database session error: {e}")
        db.rollback()
        raise
    finally:
        db.close()

def create_tables():
    """
    모든 테이블 생성
    애플리케이션 시작 시 호출
    """
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("✅ 데이터베이스 테이블 생성 완료")
    except Exception as e:
        logger.error(f"❌ 테이블 생성 실패: {e}")
        raise

def check_db_connection():
    """
    데이터베이스 연결 확인
    """
    try:
        with engine.connect() as connection:
            # SQLAlchemy 2.0에서는 text() 함수 사용 필요
            result = connection.execute(text("SELECT 1"))
            logger.info("✅ 데이터베이스 연결 성공")
            return True
    except Exception as e:
        logger.error(f"❌ 데이터베이스 연결 실패: {e}")
        return False