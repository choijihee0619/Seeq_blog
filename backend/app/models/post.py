# backend/app/models/post.py

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class PostStatus(str, enum.Enum):
    DRAFT = "draft"
    PUBLISHED = "published" 
    ARCHIVED = "archived"

class Post(Base):
    __tablename__ = "posts"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    content = Column(Text, nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    image_url = Column(String(500), nullable=True)
    status = Column(Enum(PostStatus), default=PostStatus.PUBLISHED, nullable=False)
    user_id = Column(Integer, nullable=True)  # 향후 확장용
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # 관계 설정
    category = relationship("Category", back_populates="posts")
    summary = relationship("Summary", back_populates="post", uselist=False, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Post(id={self.id}, title='{self.title}', status='{self.status}')>"