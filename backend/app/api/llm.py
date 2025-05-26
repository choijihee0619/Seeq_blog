# backend/app/api/llm.py

from fastapi import APIRouter, Body
from app.services.llm_service import llm_service
import asyncio

router = APIRouter()

@router.post("/ask-llm/", summary="LLM 자연어 질의응답", tags=["llm"])
async def ask_llm(prompt: str = Body(..., example="서울의 봄날씨를 시적으로 묘사해줘")):
    """
    LLM(예: GPT)에게 자연어로 질문하고 답변을 받습니다.
    - prompt: 사용자 질문/명령 (자유 텍스트)
    - 답변은 answer 키로 반환됨
    """
    answer = await llm_service.ask_llm(prompt)
    return {"answer": answer}
