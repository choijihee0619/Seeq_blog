# backend/app/models/summary.py

from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, Float, String, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Summary(Base):
    __tablename__ = "summaries"
    
    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("posts.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # LLM 생성 콘텐츠
    summary = Column(Text, nullable=False, comment="LLM 생성 요약")
    highlights = Column(JSON, nullable=True, comment="핵심 포인트 배열")
    keywords = Column(JSON, nullable=True, comment="키워드 배열")
    
    # LLM 메타데이터
    model_version = Column(String(50), nullable=True, default="gpt-3.5-turbo", comment="사용된 LLM 모델")
    confidence_score = Column(Float, nullable=True, comment="요약 신뢰도 점수 (0-100)")
    
    # 생성 정보
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 관계 설정
    post = relationship("Post", back_populates="summary")
    
    def __repr__(self):
        return f"<Summary(id={self.id}, post_id={self.post_id}, confidence={self.confidence_score})>"