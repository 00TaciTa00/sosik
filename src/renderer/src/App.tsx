import { useState } from 'react'
import { AppProvider, useApp } from './contexts/AppContext'
import { ToastProvider } from './components/common/Toast'
import { TabBar } from './components/common/TabBar'
import { EmptyState } from './components/common/EmptyState'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Dashboard } from './components/Dashboard/Dashboard'
import { ReleaseNoteList } from './components/ReleaseNotes/ReleaseNoteList'
import { GitGraph } from './components/GitGraph/GitGraph'
import { RepoSettings } from './components/RepoSettings/RepoSettings'
import { GlobalSettingsModal } from './components/GlobalSettings/GlobalSettingsModal'
import './styles/global.css'
import appStyles from './App.module.css'

type MainTab = 'dashboard' | 'notes' | 'graph' | 'settings'

const TABS = [
  { id: 'dashboard', label: '대시보드' },
  { id: 'notes', label: '릴리즈 노트' },
  { id: 'graph', label: '깃 그래프' },
  { id: 'settings', label: '설정' },
]

function MainContent() {
  const { selectedRepo } = useApp()
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard')

  if (!selectedRepo) {
    return (
      <main className={appStyles.main}>
        <EmptyState
          icon="🌿"
          title="레포지토리를 추가해주세요"
          description="왼쪽 사이드바에서 + 레포 추가 버튼을 눌러 시작하세요"
        />
      </main>
    )
  }

  return (
    <main className={appStyles.main}>
      <TabBar
        tabs={TABS}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as MainTab)}
      />
      <div className={appStyles.tabContent}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'notes' && <ReleaseNoteList />}
        {activeTab === 'graph' && <GitGraph />}
        {activeTab === 'settings' && <RepoSettings />}
      </div>
    </main>
  )
}

function AppShell() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className={appStyles.shell}>
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
      <MainContent />
      <GlobalSettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </AppProvider>
  )
}
