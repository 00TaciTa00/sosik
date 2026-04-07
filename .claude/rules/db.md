---
paths:
  - "src/db/**/*.ts"
  - "src/main/**/*.ts"
---
## SQLite / DB 규칙

- 모든 DB 접근은 `src/db/` 내부 함수로만 수행 — 외부에서 직접 쿼리 금지
- 스키마 변경 시 `src/db/migrations/` 에 버전 파일 추가
- 레포별 데이터는 반드시 `repo_id` 컬럼으로 격리
- 민감 정보(API Key, Access Token)는 DB 저장 금지 — electron-store 암호화 사용
- 트랜잭션이 필요한 작업은 `better-sqlite3`의 `transaction()` 사용
