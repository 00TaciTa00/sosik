# UpdateNote — 업데이트 노트 자동 생성 데스크톱 앱

## 프로젝트 개요

Electron + React 기반 데스크톱 앱.
여러 GitLab/GitHub 레포지토리를 등록하고, 배포 후 변경사항을 AI로 요약해 업데이트 노트를 자동 생성한다.

## 커맨드

```bash
npm run dev          # Electron 개발 모드 실행
npm run build        # 프로덕션 빌드 (Windows .exe / macOS .dmg)
npm run test         # Jest 테스트 실행
npm run lint         # ESLint 검사
npm run typecheck    # TypeScript 타입 체크
```

## 아키텍처

- **프레임워크**: Electron + React (TypeScript)
- **로컬 DB**: SQLite (better-sqlite3)
- **AI**: 추상화 레이어 — Claude / GPT 교체 가능 (`src/ai/provider.ts`)
- **diff 추출**: GitLab/GitHub REST API 또는 로컬 git CLI (`src/diff/`)
- **빌드**: electron-builder

## 디렉토리 구조

```bash
src/
├── main/           # Electron main process
├── renderer/       # React UI (라이트/다크, 한/영 i18n)
├── ai/             # AI 추상화 레이어
├── diff/           # git diff 추출 (API / 로컬 git)
├── db/             # SQLite 스키마 및 쿼리
└── shared/         # 공통 타입 정의
```

## 핵심 도메인 규칙

- 레포는 독립 단위: 보안 제외 규칙, 요약 언어, diff 소스 모두 레포별 설정
- 전역 보안 제외 규칙 없음 — 레포마다 완전히 독립
- 초안은 SQLite에 영구 저장 (레포별)
- AI 제공자/API Key는 전역 설정

## 코딩 컨벤션

- TypeScript strict 모드 — 미사용 변수 오류 처리
- 함수형 컴포넌트만 사용 (class 컴포넌트 금지)
- 에러는 반드시 `src/shared/error.ts`의 커스텀 에러 타입으로 처리
- `console.log` 대신 `src/shared/logger.ts` 사용
- 모든 SQLite 쿼리는 `src/db/` 내부에서만 실행

## 주의사항

- Electron main/renderer 간 통신은 반드시 IPC (`ipcMain` / `ipcRenderer`) 사용
- 민감 정보(API Key, Access Token)는 반드시 electron-store 암호화 저장
- 보안 파일 제외 규칙 적용 후 diff 추출 — 순서 바꾸면 안 됨
- `src/ai/provider.ts`의 인터페이스를 반드시 준수해야 AI 교체 가능
