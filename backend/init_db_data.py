"""
기본 데이터 생성 스크립트
카테고리 및 샘플 데이터 생성
"""

import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import Category, Tag

def create_default_categories(db: Session):
    """기본 카테고리 생성"""
    
    categories_data = [
        {"name": "독서", "description": "책 독서 및 문학 관련 내용"},
        {"name": "학습", "description": "교육, 강의, 스터디 관련 내용"}, 
        {"name": "일상", "description": "일상생활, 회의, 메모 등"},
        {"name": "기타", "description": "기타 분류되지 않은 내용"}
    ]
    
    created_count = 0
    
    for cat_data in categories_data:
        # 이미 존재하는지 확인
        existing = db.query(Category).filter(Category.name == cat_data["name"]).first()
        
        if not existing:
            category = Category(**cat_data)
            db.add(category)
            created_count += 1
            print(f"✅ 카테고리 생성: {cat_data['name']}")
        else:
            print(f"⏭️ 카테고리 이미 존재: {cat_data['name']}")
    
    db.commit()
    print(f"📝 총 {created_count}개 카테고리 생성")

def create_default_tags(db: Session):
    """기본 태그 생성"""
    
    tags_data = [
        {"name": "AI", "color": "#e3f2fd"},
        {"name": "머신러닝", "color": "#f3e5f5"},
        {"name": "프로그래밍", "color": "#e8f5e8"},
        {"name": "독서노트", "color": "#fff3e0"},
        {"name": "회의록", "color": "#fce4ec"},
        {"name": "학습정리", "color": "#f0f4c3"}
    ]
    
    created_count = 0
    
    for tag_data in tags_data:
        # 이미 존재하는지 확인
        existing = db.query(Tag).filter(Tag.name == tag_data["name"]).first()
        
        if not existing:
            tag = Tag(**tag_data)
            db.add(tag)
            created_count += 1
            print(f"✅ 태그 생성: {tag_data['name']}")
        else:
            print(f"⏭️ 태그 이미 존재: {tag_data['name']}")
    
    db.commit()
    print(f"🏷️ 총 {created_count}개 태그 생성")

def main():
    """메인 함수"""
    
    print("🚀 SeeQ 기본 데이터 생성")
    print("=" * 40)
    
    # 데이터베이스 세션 생성
    db = SessionLocal()
    
    try:
        # 1. 기본 카테고리 생성
        print("1️⃣ 기본 카테고리 생성...")
        create_default_categories(db)
        
        print()
        
        # 2. 기본 태그 생성  
        print("2️⃣ 기본 태그 생성...")
        create_default_tags(db)
        
        print("\n🎉 기본 데이터 생성 완료!")
        
    except Exception as e:
        print(f"❌ 기본 데이터 생성 실패: {e}")
        db.rollback()
        return False
    finally:
        db.close()
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)