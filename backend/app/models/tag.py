from sqlalchemy import Column, Integer, String, DateTime, Table, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from ..core.database import Base

# 게시물-태그 연관 테이블 (다대다 관계)
post_tags = Table(
    'post_tags',
    Base.metadata,
    Column('post_id', Integer, ForeignKey('posts.id'), primary_key=True),
    Column('tag_id', Integer, ForeignKey('tags.id'), primary_key=True),
    Column('created_at', DateTime(timezone=True), server_default=func.now())
)

class Tag(Base):
    """태그 모델"""
    
    __tablename__ = "tags"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, comment="태그명")
    color = Column(String(7), nullable=True, comment="태그 색상 코드 (#FFFFFF)")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="생성일시")
    
    # 관계 설정
    posts = relationship("Post", secondary=post_tags, back_populates="tags")
    
    def __repr__(self):
        return f"<Tag(id={self.id}, name='{self.name}')>"