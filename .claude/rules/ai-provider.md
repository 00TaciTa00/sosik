---
paths:
  - "src/ai/**/*.ts"
---
## AI 추상화 레이어 규칙

- 모든 AI 호출은 `src/ai/provider.ts`의 `AIProvider` 인터페이스를 반드시 구현
- Claude / GPT 구현체는 각각 `src/ai/providers/claude.ts`, `src/ai/providers/openai.ts`
- 요약 언어(한국어/영어/둘다)는 호출 시 파라미터로 전달 — 하드코딩 금지
- 토큰 사용량은 응답에 포함해 반환 (로깅 목적)
- 네트워크 오류 시 최대 2회 재시도 후 커스텀 에러 throw
