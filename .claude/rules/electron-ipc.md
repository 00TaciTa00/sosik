---
paths:
  - "src/main/**/*.ts"
  - "src/renderer/**/*.ts"
---
## Electron IPC 규칙

- main → renderer 데이터 전달은 반드시 `ipcMain.handle` / `ipcRenderer.invoke` 사용
- renderer에서 Node.js API 직접 호출 금지 — 반드시 IPC 경유
- preload 스크립트에서 `contextBridge.exposeInMainWorld`로만 API 노출
- IPC 채널명은 `kebab-case`로 통일 (예: `repo:get-all`, `diff:extract`)
- IPC 핸들러는 `src/main/ipc/` 디렉토리에 도메인별로 분리
