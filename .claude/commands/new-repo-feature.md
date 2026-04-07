---
description: 새 레포지토리 관련 기능을 추가할 때 체크리스트와 함께 구현
argument-hint: [기능 설명]
---
## 구현할 기능

$ARGUMENTS

## 현재 레포 관련 파일 구조

!`find src -name "*.ts" | grep -i repo | head -20`

## 레포 관련 DB 스키마

!`cat src/db/schema.ts 2>/dev/null || echo "schema.ts 없음"`

다음을 반드시 확인하며 구현해:

- [ ] 레포별 완전 독립 설계 (보안 규칙, 언어 설정, diff 소스)
- [ ] IPC 채널 추가 시 `src/main/ipc/repo.ts` 에 핸들러 등록
- [ ] DB 쿼리는 `src/db/repo.ts` 에만 작성
- [ ] 민감 정보는 electron-store 사용
- [ ] 삭제 시 관련 초안 기록도 함께 삭제 (cascade)
