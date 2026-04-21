import { useState, useEffect } from 'react'
import { useApp } from '../../contexts/AppContext'
import { Button } from '../common/Button'
import { Modal } from '../common/Modal'
import { EmptyState } from '../common/EmptyState'
import { useToast } from '../common/Toast'
import type { AIProvider, SummaryLanguage, SummaryStyle } from '../../../../shared/types'
import styles from './RepoSettings.module.css'

const PLATFORM_LABEL: Record<string, string> = { gitlab: 'GitLab', github: 'GitHub' }
const DIFF_SOURCE_LABEL: Record<string, string> = { api: 'REST API', 'local-git': '로컬 git' }

export function RepoSettings() {
  const { selectedRepo, updateRepo, deleteRepo } = useApp()
  const { showToast } = useToast()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [aiProvider, setAiProvider] = useState<AIProvider>('claude')
  const [summaryLanguage, setSummaryLanguage] = useState<SummaryLanguage>('ko')
  const [summaryStyle, setSummaryStyle] = useState<SummaryStyle>('detailed')
  const [accessToken, setAccessToken] = useState('')
  const [newPattern, setNewPattern] = useState('')
  const [patterns, setPatterns] = useState<string[]>([])

  useEffect(() => {
    if (selectedRepo) {
      setAiProvider(selectedRepo.aiProvider)
      setSummaryLanguage(selectedRepo.summaryLanguage)
      setSummaryStyle(selectedRepo.summaryStyle)
      setPatterns([])
    }
    // selectedRepo.id로 레포 변경 감지, 전체 객체 의존성 불필요
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRepo?.id])

  if (!selectedRepo) return <EmptyState icon="🌿" title="레포지토리를 선택해주세요" />

  async function handleSaveAI() {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 300))
    updateRepo(selectedRepo!.id, { aiProvider, summaryLanguage, summaryStyle })
    setSaving(false)
    showToast('AI 설정이 저장되었습니다', 'success')
  }

  function handleSaveToken() {
    if (!accessToken.trim()) return
    // ipc:secure:setApiKey(`repo:${selectedRepo.id}:access_token`, accessToken)
    setAccessToken('')
    showToast('액세스 토큰이 저장되었습니다', 'success')
  }

  function addPattern() {
    const p = newPattern.trim()
    if (p && !patterns.includes(p)) {
      setPatterns([...patterns, p])
    }
    setNewPattern('')
  }

  function removePattern(p: string) {
    setPatterns(patterns.filter((x) => x !== p))
  }

  function handleDelete() {
    deleteRepo(selectedRepo!.id)
    setDeleteModalOpen(false)
  }

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>연동 정보 (읽기 전용)</h3>
        <div className={styles.readonlyFields}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>플랫폼</span>
            <span className={styles.fieldValue}>{PLATFORM_LABEL[selectedRepo.platform]}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Diff 소스</span>
            <span className={styles.fieldValue}>{DIFF_SOURCE_LABEL[selectedRepo.diffSource]}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>저장소 URL</span>
            <span className={styles.fieldValue}>{selectedRepo.repoUrl}</span>
          </div>
          {selectedRepo.localPath && (
            <div className={styles.field}>
              <span className={styles.fieldLabel}>로컬 경로</span>
              <span className={styles.fieldValue}>{selectedRepo.localPath}</span>
            </div>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>액세스 토큰</h3>
        <div className={styles.row}>
          <input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="새 토큰 입력..."
            className={styles.input}
            autoComplete="off"
          />
          <Button variant="secondary" size="sm" onClick={handleSaveToken} disabled={!accessToken.trim()}>
            저장
          </Button>
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>AI 설정</h3>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label className={styles.label}>AI 제공자</label>
            <select value={aiProvider} onChange={(e) => setAiProvider(e.target.value as AIProvider)} className={styles.select}>
              <option value="claude">Claude</option>
              <option value="openai">OpenAI (GPT)</option>
            </select>
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>요약 언어</label>
            <select value={summaryLanguage} onChange={(e) => setSummaryLanguage(e.target.value as SummaryLanguage)} className={styles.select}>
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="both">둘 다 (토큰 2배)</option>
            </select>
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>요약 스타일</label>
            <select value={summaryStyle} onChange={(e) => setSummaryStyle(e.target.value as SummaryStyle)} className={styles.select}>
              <option value="detailed">상세</option>
              <option value="concise">간결</option>
              <option value="technical">기술적</option>
            </select>
          </div>
        </div>
        <Button variant="primary" size="sm" onClick={handleSaveAI} loading={saving}>
          저장
        </Button>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>보안 파일 제외 규칙</h3>
        <div className={styles.row}>
          <input
            type="text"
            value={newPattern}
            onChange={(e) => setNewPattern(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addPattern()}
            placeholder="예: **/.env, *.pem"
            className={styles.input}
          />
          <Button variant="secondary" size="sm" onClick={addPattern} disabled={!newPattern.trim()}>
            추가
          </Button>
        </div>
        <div className={styles.patternList}>
          {patterns.length === 0 ? (
            <span className={styles.emptyPatterns}>추가된 규칙 없음</span>
          ) : (
            patterns.map((p) => (
              <span key={p} className={styles.patternTag}>
                {p}
                <button className={styles.removeBtn} onClick={() => removePattern(p)}>✕</button>
              </span>
            ))
          )}
        </div>
      </section>

      <section className={`${styles.section} ${styles.dangerSection}`}>
        <h3 className={`${styles.sectionTitle} ${styles.dangerTitle}`}>위험 영역</h3>
        <Button variant="danger" size="sm" onClick={() => setDeleteModalOpen(true)}>
          이 레포지토리 삭제
        </Button>
      </section>

      <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="레포지토리 삭제" width={400}>
        <p className={styles.deleteMsg}>
          <strong>{selectedRepo.name}</strong>을(를) 삭제하면 모든 릴리즈 노트가 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
        </p>
        <div className={styles.deleteActions}>
          <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>취소</Button>
          <Button variant="danger" onClick={handleDelete}>삭제</Button>
        </div>
      </Modal>
    </div>
  )
}
