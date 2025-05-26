# backend/app/api/posts.py

from fastapi import APIRouter, Depends, HTTPException, Query, Path
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.services.post_service import PostService
from app.services.llm_service import llm_service
from app.schemas import (
    PostCreate, PostUpdate, PostList, PostDetail, 
    LLMSummaryRequest, LLMSummaryResponse
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/posts", tags=["posts"])

@router.get("/", response_model=PostList)
async def get_posts(
    skip: int = Query(0, ge=0, description="건너뛸 게시물 수"),
    limit: int = Query(20, ge=1, le=100, description="조회할 게시물 수"),
    category_id: Optional[int] = Query(None, description="카테고리 ID로 필터링"),
    search: Optional[str] = Query(None, description="제목/내용 검색어"),
    status: Optional[str] = Query(None, description="상태별 필터링"),
    db: Session = Depends(get_db)
):
    """
    게시물 목록 조회 (검색/필터링/페이징 지원)
    
    - **skip**: 건너뛸 게시물 수 (페이징)
    - **limit**: 조회할 게시물 수 (최대 100개)
    - **category_id**: 특정 카테고리의 게시물만 조회
    - **search**: 제목이나 내용에서 검색
    - **status**: 게시물 상태로 필터링 (draft/published/archived)
    """
    try:
        posts, total = PostService.get_posts_with_summaries(
            db=db,
            skip=skip,
            limit=limit,
            category_id=category_id,
            search=search,
            status=status
        )
        
        page = (skip // limit) + 1
        
        return PostList(
            posts=posts,
            total=total,
            page=page,
            size=len(posts)
        )
        
    except Exception as e:
        logger.error(f"게시물 목록 조회 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="게시물 목록 조회에 실패했습니다.")

@router.get("/{post_id}", response_model=PostDetail)
async def get_post(
    post_id: int = Path(..., description="게시물 ID"),
    db: Session = Depends(get_db)
):
    """게시물 상세 조회 (LLM 요약 포함)"""
    try:
        post = PostService.get_post_with_summary(db=db, post_id=post_id)
        if not post:
            raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
        
        return post
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"게시물 상세 조회 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="게시물 조회에 실패했습니다.")

@router.post("/", response_model=PostDetail, status_code=201)
async def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db)
):
    """
    새 게시물 생성 (LLM 자동 요약 포함)
    
    - **auto_summarize**: True일 경우 LLM이 자동으로 요약/하이라이트/키워드를 생성
    - 요약 생성에 실패해도 게시물은 정상적으로 저장됩니다
    """
    try:
        # 카테고리 존재 확인
        from app.services.post_service import CategoryService
        category = CategoryService.get_category(db=db, category_id=post_data.category_id)
        if not category:
            raise HTTPException(status_code=400, detail="존재하지 않는 카테고리입니다.")
        
        # 게시물 생성 (LLM 요약 포함)
        post = await PostService.create_post(db=db, post_data=post_data)
        
        # 생성된 게시물을 요약과 함께 조회
        created_post = PostService.get_post_with_summary(db=db, post_id=post.id)
        
        return created_post
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"게시물 생성 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="게시물 생성에 실패했습니다.")

@router.put("/{post_id}", response_model=PostDetail)
async def update_post(
    post_id: int = Path(..., description="게시물 ID"),
    post_data: PostUpdate = ...,
    db: Session = Depends(get_db)
):
    """
    게시물 수정 (필요시 LLM 요약 재생성)
    
    - **regenerate_summary**: True일 경우 LLM 요약을 강제로 재생성
    - 내용(content)이 변경되면 자동으로 요약도 재생성됩니다
    """
    try:
        # 카테고리 변경시 존재 확인
        if post_data.category_id:
            from app.services.post_service import CategoryService
            category = CategoryService.get_category(db=db, category_id=post_data.category_id)
            if not category:
                raise HTTPException(status_code=400, detail="존재하지 않는 카테고리입니다.")
        
        # 게시물 수정
        updated_post = await PostService.update_post(db=db, post_id=post_id, post_data=post_data)
        if not updated_post:
            raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
        
        # 수정된 게시물을 요약과 함께 조회
        result = PostService.get_post_with_summary(db=db, post_id=post_id)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"게시물 수정 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="게시물 수정에 실패했습니다.")

@router.delete("/{post_id}", status_code=204)
async def delete_post(
    post_id: int = Path(..., description="게시물 ID"),
    db: Session = Depends(get_db)
):
    """게시물 삭제 (LLM 요약도 함께 삭제됨)"""
    try:
        success = PostService.delete_post(db=db, post_id=post_id)
        if not success:
            raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
        
        return  # 204 No Content
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"게시물 삭제 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="게시물 삭제에 실패했습니다.")

@router.post("/{post_id}/regenerate-summary", response_model=LLMSummaryResponse)
async def regenerate_summary(
    post_id: int = Path(..., description="게시물 ID"),
    db: Session = Depends(get_db)
):
    """
    게시물의 LLM 요약을 강제로 재생성합니다.
    
    기존 요약이 만족스럽지 않거나 LLM 모델이 업데이트되었을 때 사용합니다.
    """
    try:
        # 게시물 존재 확인
        post = PostService.get_post_with_summary(db=db, post_id=post_id)
        if not post:
            raise HTTPException(status_code=404, detail="게시물을 찾을 수 없습니다.")
        
        # 카테고리 정보 조회
        category_name = post.category.name if post.category else "기타"
        
        # LLM 요약 재생성
        summary_data = await llm_service.regenerate_summary(
            post_id=post_id,
            title=post.title,
            content=post.content,
            category=category_name
        )
        
        # 데이터베이스 업데이트
        from app.models.summary import Summary
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
        
        db.commit()
        
        return LLMSummaryResponse(**summary_data)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"요약 재생성 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="요약 재생성에 실패했습니다.")

@router.post("/preview-summary", response_model=LLMSummaryResponse)
async def preview_summary(
    request: LLMSummaryRequest
):
    """
    게시물을 저장하기 전에 LLM 요약을 미리 확인할 수 있습니다.
    
    이 엔드포인트는 요약 결과만 반환하며 데이터베이스에 저장하지 않습니다.
    """
    try:
        summary_data = await llm_service.generate_summary(
            title=request.title,
            content=request.content,
            category=request.category
        )
        
        return LLMSummaryResponse(**summary_data)
        
    except Exception as e:
        logger.error(f"요약 미리보기 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="요약 생성에 실패했습니다.")