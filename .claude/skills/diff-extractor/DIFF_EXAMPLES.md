# Diff 추출 예시

## 보안 제외 규칙 적용 예시

```typescript
// 올바른 순서
const allFiles = await getChangedFiles(fromSha, toSha)
const filteredFiles = applyExcludeRules(allFiles, repo.excludeRules) // 먼저 제외
const diff = await getDiffContent(filteredFiles) // 그 다음 내용 가져오기

// 잘못된 순서 (금지)
const diff = await getDiffContent(allFiles) // 전체 diff 먼저 가져오면 안 됨
const filtered = applyExcludeRules(diff, repo.excludeRules)
```

## minimatch 패턴 예시

```typescript
import { minimatch } from 'minimatch'

function applyExcludeRules(files: string[], rules: ExcludeRules): string[] {
  return files.filter(file => {
    const matchesPath = rules.pathPatterns.some(p => minimatch(file, p))
    const matchesExt = rules.extensions.some(ext => file.endsWith(ext))
    return !matchesPath && !matchesExt
  })
}
```
