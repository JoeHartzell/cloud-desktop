import { getContext, setContext } from 'svelte'
import { derived, Readable, writable } from 'svelte/store'

const CONTEXT_KEY = Symbol('cloud-desktop:context:app')

type Profile = {
  id: string
  name: string
  region: string
}

type ProfileState = Map<Profile['id'], Profile>

function createProfiles() {
  const { subscribe, update } = writable<ProfileState>(new Map())

  function add(profile: Profile) {
    update((profiles) => profiles.set(profile.id, profile))
  }

  function remove(id: Profile['id']) {
    update((profiles) => {
      profiles.delete(id)
      return profiles
    })
  }

  return {
    subscribe,
    add,
    remove,
  }
}

type AppContext = {
  profiles: ReturnType<typeof createProfiles>
  currentProfile: Readable<Profile | null>
  setCurrentProfile(id: Profile['id']): void
}

export function setAppContext() {
  const currentProfileId = writable<Profile['id'] | null>(null)
  const profiles = createProfiles()
  const currentProfile = derived([currentProfileId, profiles], ([$id, $profiles]) => {
    return $profiles.get($id)
  })

  return setContext<AppContext>(CONTEXT_KEY, {
    profiles,
    currentProfile,
    setCurrentProfile(id: Profile['id']) {
      currentProfileId.set(id)
    },
  })
}

export function getAppContext() {
  return getContext<AppContext>(CONTEXT_KEY)
}
