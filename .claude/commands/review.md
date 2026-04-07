---
description: 현재 브랜치의 변경사항을 리뷰하고 머지 전 문제를 점검
---
## 변경된 파일 목록

!`git diff --name-only main...HEAD`

## 상세 diff

!`git diff main...HEAD`

위 변경사항을 다음 관점에서 리뷰해줘:

1. Electron IPC 규칙 준수 여부
2. DB 접근 규칙 위반 여부
3. 민감 정보 노출 위험
4. TypeScript 타입 안전성
5. 에러 핸들링 누락

파일별로 구체적인 피드백을 작성해줘.
