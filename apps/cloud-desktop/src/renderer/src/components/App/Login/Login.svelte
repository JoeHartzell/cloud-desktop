<script lang="ts">
  import { onMount } from 'svelte'
  import { push } from 'svelte-spa-router'
  import Icon from '@iconify/svelte'
  import { getAWSContext } from '../../../context/AWS'
  import { getAppContext } from '../../../context/App'
  import type { AWSRouterOutputs } from '../../../context/AWS/aws.context'

  let profiles: AWSRouterOutputs['profiles'] = []
  const { aws } = getAWSContext()
  const { sessions, clearCurrentSession } = getAppContext()

  // login page should clear the current session
  clearCurrentSession()

  onMount(async () => {
    profiles = await aws.profiles.query()
  })

  function createSession(session: (typeof profiles)[number]) {
    const sessionId = sessions.create(session)
    push(`/app/session/${sessionId}`)
  }
</script>

<div class="card mt-4 mx-auto max-w-md bg-gradient-to-br variant-gradient-tertiary-secondary">
  <header class="card-header">
    <h4 class="flex justify-center items-center h4">
      <Icon icon="mdi:aws" class="h-10 w-10" />
      <span class="m-2 pb-1">Credentials</span>
    </h4>
  </header>
  <section class="p-4 list-nav">
    <ul>
      {#each profiles as profile}
        <li>
          <a on:click={() => createSession(profile)}>
            <span class="badge bg-primary-600">Profile</span>
            <span class="flex-auto">{profile.name}</span>
            <span class="chip variant-filled">{profile.region}</span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
</div>
