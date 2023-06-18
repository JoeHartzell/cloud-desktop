<script lang="ts">
  import { AppShell, AppRail, AppRailAnchor } from '@skeletonlabs/skeleton'
  import Router from 'svelte-spa-router'
  import Icon from '@iconify/svelte'
  import { setAppContext } from '../../context/App'
  import { Header as AppHeader } from './Header'
  import { Login } from './Login'
  import { Session } from './Session'

  const { sessions, currentSession } = setAppContext()

  $: sessionList = Array.from($sessions.values())

  const prefix = '/app'
  const routes = {
    '/login': Login,
    '/session/:id': Session,
  }
</script>

<AppShell>
  <svelte:fragment slot="header">
    <AppHeader />
  </svelte:fragment>

  <svelte:fragment slot="sidebarLeft">
    <AppRail>
      <svelte:fragment slot="lead">
        <AppRailAnchor href="/">(icon)</AppRailAnchor>
      </svelte:fragment>

      {#each sessionList as session}
        <AppRailAnchor
          selected={$currentSession?.id === session.id}
          href={`#/app/session/${session.id}`}
        >
          <svelte:fragment slot="lead">
            <span class="badge bg-primary-600">{session.name}</span>
          </svelte:fragment>
          <span>{session.region}</span>
        </AppRailAnchor>
      {/each}

      <svelte:fragment slot="trail">
        <AppRailAnchor href="#/app/login">
          <Icon icon="mdi:add-bold" class="w-6 h-6 inline" />
        </AppRailAnchor>
      </svelte:fragment>
    </AppRail>
  </svelte:fragment>

  <Router {prefix} {routes} />
</AppShell>

<style lang="postcss">
  :global(html, body) {
    @apply h-full overflow-hidden;
  }
</style>
