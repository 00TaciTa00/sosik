---
name: ai-summarizer
description: |
  AI 요약 생성 작업. 프롬프트 작성, 언어별 분기, 토큰 최적화,
  변경 유형 분류 구현 시 자동 호출.
allowed-tools: Read, Grep, Glob
---

## AI 요약 구현 가이드

### 변경 유형 분류 기준
| 유형 | 판단 기준 |
|------|-----------|
| 버그수정 | fix, bug, error, crash, resolve 키워드 or 파일 경로 패턴 |
| 기능추가 | feat, add, new, implement 키워드 |
| UI변경 | components/, styles/, css, layout 관련 파일 |
| 성능개선 | perf, optimize, cache, speed 키워드 |

### 언어별 토큰 전략
- **한국어만**: 단일 API 호출
- **영어만**: 단일 API 호출
- **둘 다**: 단일 호출로 한/영 동시 생성 (프롬프트에 둘 다 요청) — 2회 호출 금지

### 프롬프트 원칙
- diff 전체를 그대로 넣지 말 것 — 파일명과 변경 요약만 전달
- 비개발자가 이해할 수 있는 언어로 작성 요청
- 기술 용어는 괄호 안에 부연 설명 포함 요청

### 토큰 경고
한/영 동시 생성 선택 시 UI에 반드시 경고 표시:
"AI 토큰이 약 2배 사용됩니다"
