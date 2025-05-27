from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from ..core.database import Base

class Tag(Base):
    """태그 모델"""

    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, comment="태그명")
    color = Column(String(7), nullable=True, comment="태그 색상 코드 (#FFFFFF)")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), comment="생성일시")

    # 관계 없음

    def __repr__(self):
        return f"<Tag(id={self.id}, name='{self.name}')>"
