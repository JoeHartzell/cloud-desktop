import { getContext, setContext } from 'svelte'
import { derived, writable } from 'svelte/store'
import type { Readable } from 'svelte/store'
import { v4 as uuid } from 'uuid'

const CONTEXT_KEY = Symbol('cloud-desktop:context:app')

type Session = {
  id: string
  name: string
  region: string
  modules: {
    all: Readable<Module[]>
    add(name: string): Module['id']
    remove(id: Module['id']): void
    setActive(id: Module['id']): void
    clearActive(): void
    active: Readable<Module | null>
  }
}

type SessionState = Map<Session['id'], Session>

type Module = {
  id: string
  name: string
}

function createModules(): Session['modules'] {
  const all = writable<Map<Module['id'], Module>>(new Map())
  const activeId = writable<Module['id'] | null>(null)
  const active = derived([all, activeId], ([$modules, $activeId]) => {
    return $activeId ? $modules.get($activeId) ?? null : null
  })

  return {
    all: derived(all, ($modules) => Array.from($modules.values())),
    add(name: string) {
      const id = uuid()
      all.update((modules) => modules.set(id, { id, name }))
      return id
    },
    remove(id: Module['id']) {
      all.update((modules) => {
        modules.delete(id)
        return modules
      })
    },
    setActive(id: Module['id']) {
      activeId.set(id)
    },
    clearActive() {
      activeId.set(null)
    },
    active,
  }
}

function createSessions() {
  const { subscribe, update } = writable<SessionState>(new Map())

  function create(session: Omit<Session, 'id'>): Session['id'] {
    const sessionId = uuid()
    update((profiles) =>
      profiles.set(sessionId, {
        ...session,
        modules: createModules(),
        id: sessionId,
      }),
    )

    return sessionId
  }

  function remove(id: Session['id']) {
    update((sessions) => {
      sessions.delete(id)
      return sessions
    })
  }

  return {
    subscribe,
    create,
    remove,
  }
}

type AppContext = {
  sessions: ReturnType<typeof createSessions>
  currentSession: Readable<Session | null>
  setCurrentSession(id: Session['id']): void
  clearCurrentSession(): void
}

export function setAppContext() {
  const currentSessionId = writable<Session['id'] | null>(null)
  function setCurrentSession(id: Session['id']) {
    currentSessionId.set(id)
  }

  function clearCurrentSession() {
    currentSessionId.set(null)
  }

  const sessions = createSessions()
  const currentSession = derived([currentSessionId, sessions], ([$id, $sessions]) => {
    return $sessions.get($id)
  })

  return setContext<AppContext>(CONTEXT_KEY, {
    sessions,
    currentSession,
    setCurrentSession,
    clearCurrentSession,
  })
}

export function getAppContext() {
  return getContext<AppContext>(CONTEXT_KEY)
}
