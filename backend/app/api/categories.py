# backend/app/api/categories.py

from fastapi import APIRouter, Depends, HTTPException, Path
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.services.post_service import CategoryService
from app.schemas import (
    CategoryCreate, CategoryUpdate, Category, BaseResponse
)
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=List[Category])
async def get_categories(db: Session = Depends(get_db)):
    """카테고리 목록 조회"""
    try:
        categories = CategoryService.get_categories(db=db)
        return categories
    except Exception as e:
        logger.error(f"카테고리 목록 조회 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="카테고리 목록 조회에 실패했습니다.")

@router.get("/{category_id}", response_model=Category)
async def get_category(
    category_id: int = Path(..., description="카테고리 ID"),
    db: Session = Depends(get_db)
):
    """카테고리 상세 조회"""
    try:
        category = CategoryService.get_category(db=db, category_id=category_id)
        if not category:
            raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")
        return category
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"카테고리 조회 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="카테고리 조회에 실패했습니다.")

@router.post("/", response_model=Category, status_code=201)
async def create_category(
    category_data: CategoryCreate,
    db: Session = Depends(get_db)
):
    """새 카테고리 생성"""
    try:
        category = CategoryService.create_category(db=db, category_data=category_data)
        return category
    except Exception as e:
        logger.error(f"카테고리 생성 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="카테고리 생성에 실패했습니다.")

@router.put("/{category_id}", response_model=Category)
async def update_category(
    category_id: int = Path(..., description="카테고리 ID"),
    category_data: CategoryUpdate = ...,
    db: Session = Depends(get_db)
):
    """카테고리 수정"""
    try:
        updated_category = CategoryService.update_category(
            db=db, category_id=category_id, category_data=category_data
        )
        if not updated_category:
            raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")
        return updated_category
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"카테고리 수정 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="카테고리 수정에 실패했습니다.")

@router.delete("/{category_id}", response_model=BaseResponse)
async def delete_category(
    category_id: int = Path(..., description="카테고리 ID"),
    db: Session = Depends(get_db)
):
    """카테고리 삭제"""
    try:
        success = CategoryService.delete_category(db=db, category_id=category_id)
        if not success:
            raise HTTPException(status_code=404, detail="카테고리를 찾을 수 없습니다.")
        
        return BaseResponse(
            success=True,
            message="카테고리가 성공적으로 삭제되었습니다."
        )
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"카테고리 삭제 실패: {str(e)}")
        raise HTTPException(status_code=500, detail="카테고리 삭제에 실패했습니다.")