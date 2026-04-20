import { useState } from 'react'
import { useApp } from '../../contexts/AppContext'
import { EmptyState } from '../common/EmptyState'
import { ChangeTypeChip } from './ChangeTypeChip'
import { ReleaseNoteDetail } from './ReleaseNoteDetail'
import type { ReleaseNote } from '../../../../shared/types'
import styles from './ReleaseNoteList.module.css'

export function ReleaseNoteList() {
  const { selectedRepo, releaseNotes } = useApp()
  const [selectedNote, setSelectedNote] = useState<ReleaseNote | null>(null)

  if (!selectedRepo) return <EmptyState icon="🌿" title="레포지토리를 선택해주세요" />

  const notes = releaseNotes
    .filter((n) => n.repoId === selectedRepo.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  if (notes.length === 0) {
    return (
      <EmptyState
        icon="📝"
        title="릴리즈 노트가 없습니다"
        description="대시보드에서 새 커밋 확인 후 AI 요약을 생성해보세요"
      />
    )
  }

  if (selectedNote) {
    return (
      <ReleaseNoteDetail
        note={selectedNote}
        repo={selectedRepo}
        onBack={() => setSelectedNote(null)}
      />
    )
  }

  return (
    <div className={styles.container}>
      {notes.map((note) => (
        <button
          key={note.id}
          className={styles.card}
          onClick={() => setSelectedNote(note)}
        >
          <div className={styles.cardHeader}>
            <div className={styles.meta}>
              {note.versionTag && (
                <span className={styles.version}>{note.versionTag}</span>
              )}
              <span className={styles.date}>
                {new Date(note.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className={styles.chips}>
              {note.changeTypes.map((t) => (
                <ChangeTypeChip key={t} type={t} />
              ))}
            </div>
          </div>
          <div className={styles.preview}>
            {(note.editedKo ?? note.aiDraftKo ?? note.editedEn ?? note.aiDraftEn ?? '').slice(
              0,
              120
            )}
            …
          </div>
          <div className={styles.shas}>
            <code className={styles.sha}>{note.fromSha.slice(0, 7)}</code>
            <span className={styles.arrow}>→</span>
            <code className={styles.sha}>{note.toSha.slice(0, 7)}</code>
          </div>
        </button>
      ))}
    </div>
  )
}
