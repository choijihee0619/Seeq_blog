from openai import OpenAI
from typing import Dict
from app.core.config import settings
import logging
import json

logger = logging.getLogger(__name__)

class LLMService:
    def __init__(self):
        pass

    async def generate_summary(self, title: str, content: str, category: str) -> Dict:
        try:
            prompt = self._build_summary_prompt(title, content, category)
            response = await self._call_openai_api(prompt)
            result = self._parse_response(response)
            logger.info(f"LLM 요약 생성 성공 - 제목: {title}")
            return result
        except Exception as e:
            logger.error(f"LLM 요약 생성 실패: {str(e)}")
            return self._create_fallback_summary(title, content)

    async def ask_llm(self, prompt: str) -> str:
        """
        자유로운 자연어 질문에 대해 LLM(OpenAI)로부터 답변을 받습니다.
        """
        try:
            system_prompt = "Assistant로서 사용자 질문에 자연어로 답변하세요. 반드시 한국어로 답변하세요."
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]
            client = OpenAI(api_key=settings.OPENAI_API_KEY)

            response = client.chat.completions.create(
                model="gpt-3.5-turbo",  # gpt-4-1106-preview는 권한 있으면 사용
                messages=messages,
                max_tokens=400,
                temperature=0.7
            )
            answer = response.choices[0].message.content.strip()
            logger.info(f"LLM 자유질문 응답 성공: {answer[:40]}...")
            return answer
        except Exception as e:
            logger.error(f"LLM 자유질문 응답 실패: {str(e)}")
            return "죄송합니다. 답변을 생성하는 데 실패했습니다."
        
    def _build_summary_prompt(self, title: str, content: str, category: str) -> str:
        category_context = {
            "독서": "이 텍스트는 독서 관련 내용입니다. 책의 핵심 내용과 인사이트를 중심으로 요약해주세요.",
            "학습": "이 텍스트는 학습 자료입니다. 핵심 개념과 중요한 학습 포인트를 중심으로 요약해주세요.",
            "일상": "이 텍스트는 일상 기록입니다. 주요 사건과 의미 있는 내용을 중심으로 요약해주세요.",
            "기타": "이 텍스트의 주요 내용과 핵심 포인트를 중심으로 요약해주세요."
        }
        context = category_context.get(category, category_context["기타"])
        prompt = f"""
당신은 전문적인 문서 요약 AI입니다. 주어진 텍스트를 분석하여 다음 형식으로 응답해주세요.

**컨텍스트**: {context}

**분석할 텍스트**:
제목: {title}
내용: {content}

**요청사항**:
1. 3-5줄의 간결하고 핵심적인 요약 생성
2. 3-5개의 중요한 하이라이트 추출 (각각 1-2줄)
3. 5-8개의 핵심 키워드 추출
4. 신뢰도 점수 (1-100) 제공

**응답 형식 (반드시 유효한 JSON으로 응답)**:
{{
    "summary": "핵심 내용을 3-5줄로 요약한 텍스트",
    "highlights": [
        "첫 번째 핵심 포인트",
        "두 번째 핵심 포인트",
        "세 번째 핵심 포인트"
    ],
    "keywords": ["키워드1", "키워드2", "키워드3", "키워드4", "키워드5"],
    "confidence_score": 95
}}

중요: 응답은 반드시 유효한 JSON 형식이어야 하며, 한국어로 작성해주세요.
"""
        return prompt.strip()
    
    async def _call_openai_api(self, prompt: str) -> str:
        try:
            client = OpenAI(api_key=settings.OPENAI_API_KEY)
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": "당신은 한국어 문서 요약 전문가입니다. 항상 유효한 JSON 형식으로 응답하세요."
                    },
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.3
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"OpenAI API 호출 실패: {str(e)}")
            raise

    def _parse_response(self, response: str) -> Dict:
        try:
            if "```json" in response:
                start = response.find("```json") + 7
                end = response.find("```", start)
                json_str = response[start:end].strip()
            elif "```" in response:
                start = response.find("```") + 3
                end = response.find("```", start)
                json_str = response[start:end].strip()
            else:
                json_str = response
            result = json.loads(json_str)
            required_fields = ["summary", "highlights", "keywords", "confidence_score"]
            for field in required_fields:
                if field not in result:
                    raise ValueError(f"필수 필드 누락: {field}")
            if not isinstance(result["highlights"], list):
                result["highlights"] = [str(result["highlights"])]
            if not isinstance(result["keywords"], list):
                result["keywords"] = [str(result["keywords"])]
            if not isinstance(result["confidence_score"], (int, float)):
                result["confidence_score"] = 75.0
            result["confidence_score"] = max(0, min(100, float(result["confidence_score"])))
            return result
        except json.JSONDecodeError as e:
            logger.error(f"JSON 파싱 실패: {str(e)}, 응답: {response}")
            raise ValueError("LLM 응답의 JSON 형식이 올바르지 않습니다.")
        except Exception as e:
            logger.error(f"응답 파싱 실패: {str(e)}")
            raise

    def _create_fallback_summary(self, title: str, content: str) -> Dict:
        summary = content[:200] + "..." if len(content) > 200 else content
        paragraphs = content.split('\n\n')
        highlights = []
        for paragraph in paragraphs[:3]:
            if paragraph.strip():
                first_sentence = paragraph.strip().split('.')[0] + '.'
                if len(first_sentence) > 10:
                    highlights.append(first_sentence[:100])
        if not highlights:
            highlights = [f"{title}에 대한 내용입니다.", "자세한 내용은 원문을 참조하세요."]
        keywords = [word for word in title.split() if len(word) > 1][:5]
        if not keywords:
            keywords = ["문서", "내용", "정보"]
        return {
            "summary": f"'{title}'에 대한 내용입니다. " + summary,
            "highlights": highlights,
            "keywords": keywords,
            "confidence_score": 30.0
        }

    async def regenerate_summary(self, post_id: int, title: str, content: str, category: str) -> Dict:
        logger.info(f"게시물 {post_id} 요약 재생성 시작")
        result = await self.generate_summary(title, content, category)
        result["regenerated"] = True
        return result

llm_service = LLMService()
