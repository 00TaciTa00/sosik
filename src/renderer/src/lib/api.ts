import type { Repository, ReleaseNote, GlobalSettings } from '../../../shared/types'

declare global {
  interface Window {
    api: {
      invoke(channel: string, ...args: unknown[]): Promise<unknown>
      on(channel: string, callback: (...args: unknown[]) => void): () => void
    }
  }
}

function invoke<T>(channel: string, ...args: unknown[]): Promise<T> {
  return window.api.invoke(channel, ...args) as Promise<T>
}

export const api = {
  repo: {
    getAll: (): Promise<Repository[]> =>
      invoke('repo:get-all'),
    add: (repo: Repository): Promise<Repository> =>
      invoke('repo:add', repo),
    updateSettings: (id: string, patch: Partial<Repository>): Promise<void> =>
      invoke('repo:update-settings', id, patch),
    delete: (id: string): Promise<void> =>
      invoke('repo:delete', id),
  },

  releaseNote: {
    getByRepo: (repoId: string): Promise<ReleaseNote[]> =>
      invoke('release-note:get-by-repo', repoId),
    update: (id: number, patch: Partial<ReleaseNote>): Promise<void> =>
      invoke('release-note:update', id, patch),
  },

  settings: {
    get: (): Promise<GlobalSettings> =>
      invoke('settings:get'),
    update: (patch: Partial<GlobalSettings>): Promise<void> =>
      invoke('settings:update', patch),
  },

  // P1 구현 예정
  diff: {
    check: (_repoId: string): Promise<{ hasNew: boolean; commitCount: number }> =>
      Promise.resolve({ hasNew: false, commitCount: 0 }),
    extract: (_repoId: string): Promise<string> =>
      Promise.resolve(''),
  },

  // P1 구현 예정
  ai: {
    generate: (_repoId: string, _diff: string): Promise<ReleaseNote> =>
      Promise.reject(new Error('ipc:ai:generate not implemented')),
  },

  secure: {
    getApiKey: (key: string): Promise<string | undefined> =>
      invoke('secure:get-api-key', key),
    setApiKey: (key: string, value: string): Promise<void> =>
      invoke('secure:set-api-key', key, value),
  },
}
