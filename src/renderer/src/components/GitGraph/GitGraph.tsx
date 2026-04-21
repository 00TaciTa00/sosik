import { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { Button } from '../common/Button'
import { EmptyState } from '../common/EmptyState'
import { useToast } from '../common/Toast'
import styles from './GitGraph.module.css'

interface CommitRow {
  sha: string
  message: string
  author: string
  date: string
}

const MOCK_COMMITS: CommitRow[] = [
  { sha: 'ghi9012def', message: 'feat: 알림 설정 페이지 추가', author: 'dev1', date: '2026-04-20T10:30:00Z' },
  { sha: 'def5678abc', message: 'fix: 로그인 세션 만료 처리', author: 'dev2', date: '2026-04-19T15:00:00Z' },
  { sha: 'abc1234xyz', message: 'style: 버튼 컴포넌트 통일', author: 'dev1', date: '2026-04-18T09:00:00Z' },
  { sha: 'xyz0987uvw', message: 'chore: 의존성 업데이트', author: 'dev3', date: '2026-04-17T11:20:00Z' },
]

export function GitGraph() {
  const { selectedRepo } = useApp()
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [commits] = useState<CommitRow[]>(MOCK_COMMITS)

  if (!selectedRepo) return <EmptyState icon="🌿" title="레포지토리를 선택해주세요" />

  async function handleRefresh() {
    setLoading(true)
    // ipc:diff:check
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    showToast('커밋 내역을 새로고침했습니다', 'success')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>커밋 내역</h3>
          <p className={styles.baseline}>
            기준 SHA: <code className={styles.sha}>{selectedRepo.baselineSha || '(없음)'}</code>
          </p>
        </div>
        <Button variant="secondary" onClick={handleRefresh} loading={loading} size="sm">
          새로고침
        </Button>
      </div>

      {commits.length === 0 ? (
        <EmptyState icon="📋" title="커밋 내역이 없습니다" />
      ) : (
        <div className={styles.table}>
          <div className={styles.thead}>
            <span>SHA</span>
            <span>메시지</span>
            <span>작성자</span>
            <span>날짜</span>
          </div>
          {commits.map((c) => (
            <div key={c.sha} className={styles.row}>
              <code className={styles.sha}>{c.sha.slice(0, 7)}</code>
              <span className={styles.message}>{c.message}</span>
              <span className={styles.author}>{c.author}</span>
              <span className={styles.date}>
                {new Date(c.date).toLocaleDateString('ko-KR')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
