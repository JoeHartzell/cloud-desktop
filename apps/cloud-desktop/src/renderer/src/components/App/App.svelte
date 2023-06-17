<script lang="ts">
  import { AppShell, AppRail, AppRailAnchor, AppRailTile } from '@skeletonlabs/skeleton'
  import Router, { } from 'svelte-spa-router'
  import { Header as AppHeader } from './Header'
  import { Login } from './Login'

  let currentTile = 'tile-1';
  const prefix = '/app'
  const routes = {
    '/login': Login
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

      <AppRailTile bind:group={currentTile} name="tile-1" value={0} title="tile-1">
        <svelte:fragment slot="lead">
          <span class="badge bg-primary-600">Desktop</span>
        </svelte:fragment>
        <span>us-east-1</span>
      </AppRailTile>

      <svelte:fragment slot="trail">
        <AppRailAnchor href="/" target="_blank" title="Account">(icon)</AppRailAnchor>
      </svelte:fragment>
    </AppRail>
  </svelte:fragment>

  <Router {prefix} {routes} />
</AppShell>

<style lang="postcss">
  :global(html, body) { @apply h-full overflow-hidden; }
</style>
