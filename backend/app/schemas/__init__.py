# backend/app/schemas/__init__.py

from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from typing import Optional, List
from enum import Enum

# Enums
class PostStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"

# Category Schemas
class CategoryBase(BaseModel):
    name: str = Field(..., max_length=100, description="카테고리명")
    description: Optional[str] = Field(None, max_length=500, description="카테고리 설명")

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = Field(None, max_length=500)

class Category(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime
    updated_at: datetime

# Summary Schemas
class SummaryBase(BaseModel):
    summary: str = Field(..., description="LLM 생성 요약")
    highlights: Optional[List[str]] = Field(default=[], description="핵심 포인트 목록")
    keywords: Optional[List[str]] = Field(default=[], description="키워드 목록")
    model_version: Optional[str] = Field(default="gpt-3.5-turbo", description="사용된 LLM 모델")
    confidence_score: Optional[float] = Field(default=0.0, ge=0, le=100, description="요약 신뢰도 점수")

class SummaryCreate(SummaryBase):
    post_id: int

class SummaryUpdate(BaseModel):
    summary: Optional[str] = None
    highlights: Optional[List[str]] = None
    keywords: Optional[List[str]] = None
    model_version: Optional[str] = None
    confidence_score: Optional[float] = Field(None, ge=0, le=100)

class Summary(SummaryBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    post_id: int
    created_at: datetime
    updated_at: datetime

# Post Schemas
class PostBase(BaseModel):
    title: str = Field(..., max_length=255, description="게시물 제목")
    content: str = Field(..., description="게시물 내용")
    category_id: int = Field(..., description="카테고리 ID")
    image_url: Optional[str] = Field(None, max_length=500, description="대표 이미지 URL")
    status: PostStatus = Field(default=PostStatus.PUBLISHED, description="게시물 상태")

class PostCreate(PostBase):
    auto_summarize: bool = Field(default=True, description="자동 요약 생성 여부")

class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    content: Optional[str] = None
    category_id: Optional[int] = None
    image_url: Optional[str] = Field(None, max_length=500)
    status: Optional[PostStatus] = None
    regenerate_summary: bool = Field(default=False, description="요약 재생성 여부")

class Post(PostBase):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    # 관계 데이터
    category: Optional[Category] = None
    summary: Optional[Summary] = None

class PostWithSummary(Post):
    """요약 정보가 포함된 게시물 응답"""
    summary: Optional[Summary] = None

# API Response Schemas
class PostList(BaseModel):
    """게시물 목록 응답"""
    posts: List[PostWithSummary]
    total: int
    page: int
    size: int
    
class PostDetail(PostWithSummary):
    """게시물 상세 응답"""
    pass

# LLM 관련 Schemas
class LLMSummaryRequest(BaseModel):
    title: str = Field(..., description="요약할 텍스트 제목")
    content: str = Field(..., description="요약할 텍스트 내용") 
    category: str = Field(..., description="카테고리명")

class LLMSummaryResponse(BaseModel):
    summary: str = Field(..., description="생성된 요약")
    highlights: List[str] = Field(..., description="추출된 하이라이트")
    keywords: List[str] = Field(..., description="추출된 키워드")
    confidence_score: float = Field(..., description="신뢰도 점수")
    regenerated: bool = Field(default=False, description="재생성 여부")

# Response Schemas
class BaseResponse(BaseModel):
    """기본 응답 스키마"""
    success: bool = True
    message: str = "성공"

class CategoryResponse(Category):
    """카테고리 응답 스키마"""
    pass

class PostResponse(Post):
    """게시물 응답 스키마"""
    pass

# Health Check Schema
class HealthCheck(BaseModel):
    status: str = "healthy"
    timestamp: datetime
    database: str = "connected"
    openai: str = "configured"