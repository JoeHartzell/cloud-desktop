<script lang="ts">
  import { AppShell, AppRail, AppRailAnchor } from '@skeletonlabs/skeleton'
  import Router, { location } from 'svelte-spa-router'
  import Icon from '@iconify/svelte'
  import { setAppContext } from '../../context/App'
  import { Header as AppHeader } from './Header'
  import { Login } from './Login'
  import { Profile } from './Profile'

  const { profiles, currentProfile } = setAppContext()

  $: profileList = Array.from($profiles.values())

  const prefix = '/app'
  const routes = {
    '/login': Login,
    '/profile/:id': Profile,
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

      {#each profileList as profile}
        <AppRailAnchor
          selected={$currentProfile?.id === profile.id}
          href={`#/app/profile/${profile.id}`}
        >
          <svelte:fragment slot="lead">
            <span class="badge bg-primary-600">{profile.name}</span>
          </svelte:fragment>
          <span>{profile.region}</span>
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
