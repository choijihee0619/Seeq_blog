# backend/app/services/post_service.py

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, desc
from typing import List, Optional, Tuple
from app.models.post import Post
from app.models.category import Category
from app.models.summary import Summary
from app.schemas import PostCreate, PostUpdate, CategoryCreate, CategoryUpdate
from app.services.llm_service import llm_service
import logging

logger = logging.getLogger(__name__)

class PostService:
    
    @staticmethod
    async def create_post(db: Session, post_data: PostCreate) -> Post:
        """새 게시물 생성 (LLM 요약 포함)"""
        try:
            # 1. 게시물 생성
            db_post = Post(
                title=post_data.title,
                content=post_data.content,
                category_id=post_data.category_id,
                image_url=post_data.image_url,
                status=post_data.status
            )
            
            db.add(db_post)
            db.flush()  # ID 생성을 위해 flush
            
            # 2. 카테고리 정보 조회
            category = db.query(Category).filter(Category.id == post_data.category_id).first()
            category_name = category.name if category else "기타"
            
            # 3. LLM 요약 생성 (auto_summarize가 True인 경우)
            summary_data = None
            if post_data.auto_summarize:
                try:
                    logger.info(f"게시물 '{post_data.title}' LLM 요약 생성 시작")
                    summary_data = await llm_service.generate_summary(
                        title=post_data.title,
                        content=post_data.content,
                        category=category_name
                    )
                    logger.info(f"LLM 요약 생성 완료 - 신뢰도: {summary_data.get('confidence_score', 0)}")
                    
                except Exception as e:
                    logger.error(f"LLM 요약 생성 실패: {str(e)}")
                    # 요약 생성 실패해도 게시물은 저장
                    summary_data = None
            
            # 4. Summary 레코드 생성
            if summary_data:
                db_summary = Summary(
                    post_id=db_post.id,
                    summary=summary_data["summary"],
                    highlights=summary_data["highlights"],
                    keywords=summary_data["keywords"],
                    model_version=summary_data.get("model_version", "gpt-3.5-turbo"),
                    confidence_score=summary_data["confidence_score"]
                )
                db.add(db_summary)
            
            db.commit()
            db.refresh(db_post)
            
            logger.info(f"게시물 생성 완료 - ID: {db_post.id}, 제목: {post_data.title}")
            return db_post
            
        except Exception as e:
            db.rollback()
            logger.error(f"게시물 생성 실패: {str(e)}")
            raise
    
    @staticmethod
    async def update_post(db: Session, post_id: int, post_data: PostUpdate) -> Optional[Post]:
        """게시물 수정 (필요시 요약 재생성)"""
        try:
            # 1. 기존 게시물 조회
            db_post = db.query(Post).filter(Post.id == post_id).first()
            if not db_post:
                return None
            
            # 2. 게시물 정보 업데이트
            update_data = post_data.model_dump(exclude_unset=True, exclude={"regenerate_summary"})
            for field, value in update_data.items():
                setattr(db_post, field, value)
            
            # 3. 요약 재생성 (regenerate_summary=True 또는 content 변경시)
            content_changed = hasattr(post_data, 'content') and post_data.content is not None
            should_regenerate = post_data.regenerate_summary or content_changed
            
            if should_regenerate:
                # 카테고리 정보 조회
                category = db.query(Category).filter(Category.id == db_post.category_id).first()
                category_name = category.name if category else "기타"
                
                try:
                    logger.info(f"게시물 {post_id} 요약 재생성 시작")
                    summary_data = await llm_service.regenerate_summary(
                        post_id=post_id,
                        title=db_post.title,
                        content=db_post.content,
                        category=category_name
                    )
                    
                    # 기존 요약 업데이트 또는 생성
                    existing_summary = db.query(Summary).filter(Summary.post_id == post_id).first()
                    if existing_summary:
                        existing_summary.summary = summary_data["summary"]
                        existing_summary.highlights = summary_data["highlights"]
                        existing_summary.keywords = summary_data["keywords"]
                        existing_summary.confidence_score = summary_data["confidence_score"]
                        existing_summary.model_version = summary_data.get("model_version", "gpt-3.5-turbo")
                    else:
                        new_summary = Summary(
                            post_id=post_id,
                            summary=summary_data["summary"],
                            highlights=summary_data["highlights"],
                            keywords=summary_data["keywords"],
                            model_version=summary_data.get("model_version", "gpt-3.5-turbo"),
                            confidence_score=summary_data["confidence_score"]
                        )
                        db.add(new_summary)
                    
                    logger.info(f"게시물 {post_id} 요약 재생성 완료")
                    
                except Exception as e:
                    logger.error(f"요약 재생성 실패: {str(e)}")
                    # 요약 재생성 실패해도 게시물 수정은 계속 진행
            
            db.commit()
            db.refresh(db_post)
            
            logger.info(f"게시물 수정 완료 - ID: {post_id}")
            return db_post
            
        except Exception as e:
            db.rollback()
            logger.error(f"게시물 수정 실패: {str(e)}")
            raise
    
    @staticmethod
    def get_post_with_summary(db: Session, post_id: int) -> Optional[Post]:
        """게시물 상세 조회 (요약 포함)"""
        return db.query(Post).options(
            joinedload(Post.category),
            joinedload(Post.summary)
        ).filter(Post.id == post_id).first()
    
    @staticmethod
    def get_posts_with_summaries(
        db: Session, 
        skip: int = 0, 
        limit: int = 20,
        category_id: Optional[int] = None,
        search: Optional[str] = None,
        status: Optional[str] = None
    ) -> Tuple[List[Post], int]:
        """게시물 목록 조회 (요약 포함, 검색/필터링)"""
        
        # 기본 쿼리 구성
        query = db.query(Post).options(
            joinedload(Post.category),
            joinedload(Post.summary)
        )
        
        # 필터링 조건
        conditions = []
        
        if category_id:
            conditions.append(Post.category_id == category_id)
        
        if status:
            conditions.append(Post.status == status)
        
        if search:
            search_condition = or_(
                Post.title.ilike(f"%{search}%"),
                Post.content.ilike(f"%{search}%")
            )
            conditions.append(search_condition)
        
        if conditions:
            query = query.filter(and_(*conditions))
        
        # 전체 개수 조회
        total = query.count()
        
        # 페이징 및 정렬
        posts = query.order_by(desc(Post.created_at)).offset(skip).limit(limit).all()
        
        return posts, total
    
    @staticmethod
    def delete_post(db: Session, post_id: int) -> bool:
        """게시물 삭제 (요약도 함께 삭제)"""
        try:
            db_post = db.query(Post).filter(Post.id == post_id).first()
            if not db_post:
                return False
            
            # CASCADE 설정으로 요약도 자동 삭제됨
            db.delete(db_post)
            db.commit()
            
            logger.info(f"게시물 삭제 완료 - ID: {post_id}")
            return True
            
        except Exception as e:
            db.rollback()
            logger.error(f"게시물 삭제 실패: {str(e)}")
            return False

class CategoryService:
    
    @staticmethod
    def create_category(db: Session, category_data: CategoryCreate) -> Category:
        """카테고리 생성"""
        db_category = Category(
            name=category_data.name,
            description=category_data.description
        )
        db.add(db_category)
        db.commit()
        db.refresh(db_category)
        return db_category
    
    @staticmethod
    def get_categories(db: Session) -> List[Category]:
        """카테고리 목록 조회"""
        return db.query(Category).order_by(Category.name).all()
    
    @staticmethod
    def get_category(db: Session, category_id: int) -> Optional[Category]:
        """카테고리 조회"""
        return db.query(Category).filter(Category.id == category_id).first()
    
    @staticmethod
    def update_category(db: Session, category_id: int, category_data: CategoryUpdate) -> Optional[Category]:
        """카테고리 수정"""
        db_category = db.query(Category).filter(Category.id == category_id).first()
        if not db_category:
            return None
        
        update_data = category_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_category, field, value)
        
        db.commit()
        db.refresh(db_category)
        return db_category
    
    @staticmethod
    def delete_category(db: Session, category_id: int) -> bool:
        """카테고리 삭제"""
        db_category = db.query(Category).filter(Category.id == category_id).first()
        if not db_category:
            return False
        
        # 해당 카테고리를 사용하는 게시물이 있는지 확인
        post_count = db.query(Post).filter(Post.category_id == category_id).count()
        if post_count > 0:
            raise ValueError(f"카테고리에 {post_count}개의 게시물이 있어 삭제할 수 없습니다.")
        
        db.delete(db_category)
        db.commit()
        return True