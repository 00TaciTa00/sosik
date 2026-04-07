---
description: 코드베이스 전체의 보안 취약점 점검 (민감 정보 노출, 파일 제외 규칙 등)
---
## 현재 코드베이스 파일 목록

!`find src -name "*.ts" | head -50`

## 환경변수/민감 정보 관련 파일 확인

!`grep -rn "process.env\|apiKey\|accessToken\|secret" src --include="*.ts" | head -30`

다음 항목을 점검해줘:

1. API Key / Access Token이 DB나 평문으로 저장되는 곳
2. `.env` 파일 직접 읽기 시도
3. 보안 파일 제외 규칙이 diff 추출 전에 적용되는지
4. IPC를 통하지 않고 renderer에서 Node.js API를 직접 호출하는 곳
5. electron-store 암호화 설정 누락 여부
