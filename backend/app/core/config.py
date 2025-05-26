from pydantic_settings import BaseSettings
from typing import Optional, List
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

class Settings(BaseSettings):
    """애플리케이션 설정"""
    
    # 데이터베이스 설정
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "mysql+mysqlconnector://root:password@localhost:3306/seeq_blog"
    )
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "password")
    MYSQL_DATABASE: str = os.getenv("MYSQL_DATABASE", "seeq_blog")
    
    # OpenAI API 설정
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # FastAPI 설정
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # 개발 환경 설정
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # CORS 설정 (문자열로 저장 후 필요시 리스트로 변환)
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS", 
        "http://localhost:3000,http://127.0.0.1:3000"
    )
    
    @property
    def get_allowed_origins(self) -> List[str]:
        """ALLOWED_ORIGINS를 리스트로 변환"""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# 전역 설정 인스턴스
settings = Settings()