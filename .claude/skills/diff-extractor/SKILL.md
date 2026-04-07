---
name: diff-extractor
description: |
  git diff 추출 작업. 레포에서 변경사항을 가져오거나,
  보안 파일 제외 규칙을 적용하거나, API vs 로컬 git 방식을 구현할 때 자동 호출.
allowed-tools: Read, Grep, Glob, Bash
---

## Diff 추출 구현 가이드

### 핵심 원칙
1. 보안 파일 제외 규칙은 diff 추출 **전에** 적용 (순서 절대 변경 금지)
2. API 방식과 로컬 git 방식은 동일한 인터페이스(`DiffExtractor`)를 구현
3. 레포별 설정(`repo.diffSource`, `repo.excludeRules`)을 반드시 파라미터로 받음

### 보안 제외 규칙 적용 순서
```
1. 변경된 파일 목록 수신
2. excludePathPatterns 매칭 (minimatch 사용)
3. excludeExtensions 매칭
4. 제외 후 남은 파일만 diff 내용 요청
```

### 인터페이스
```typescript
interface DiffExtractor {
  extract(params: {
    repoId: string
    fromSha: string
    toSha: string
    excludeRules: ExcludeRules
  }): Promise<DiffResult>
}
```

### 참고 파일
@DIFF_EXAMPLES.md
