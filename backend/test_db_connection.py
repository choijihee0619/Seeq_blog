"""
데이터베이스 연결 및 테이블 생성 테스트 스크립트
"""

import sys
import os

# 현재 스크립트의 디렉토리를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import check_db_connection, create_tables
from app.core.config import settings
from app.models import Category, Post, Summary, Tag

def main():
    """메인 테스트 함수"""
    
    print("🔧 SeeQ 데이터베이스 연결 테스트")
    print("=" * 50)
    
    # 설정 정보 출력
    print(f"📊 데이터베이스 URL: {settings.DATABASE_URL}")
    print(f"🏠 호스트: {settings.MYSQL_HOST}:{settings.MYSQL_PORT}")
    print(f"🗄️ 데이터베이스: {settings.MYSQL_DATABASE}")
    print(f"👤 사용자: {settings.MYSQL_USER}")
    print()
    
    # 1. 데이터베이스 연결 테스트
    print("1️⃣ 데이터베이스 연결 테스트...")
    if not check_db_connection():
        print("❌ 데이터베이스 연결 실패!")
        print("💡 해결 방법:")
        print("   - MySQL 서버가 실행 중인지 확인")
        print("   - .env 파일의 데이터베이스 정보 확인")
        print("   - 데이터베이스가 존재하는지 확인")
        return False
    
    # 2. 테이블 생성
    print("\n2️⃣ 데이터베이스 테이블 생성...")
    try:
        create_tables()
        print("✅ 모든 테이블 생성 완료!")
    except Exception as e:
        print(f"❌ 테이블 생성 실패: {e}")
        return False
    
    # 3. 모델 확인
    print("\n3️⃣ 생성된 모델 확인...")
    models = [Category, Post, Summary, Tag]
    for model in models:
        print(f"   ✅ {model.__name__}: {model.__tablename__}")
    
    print("\n🎉 데이터베이스 설정 완료!")
    print("💡 이제 FastAPI 애플리케이션을 시작할 수 있습니다.")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)