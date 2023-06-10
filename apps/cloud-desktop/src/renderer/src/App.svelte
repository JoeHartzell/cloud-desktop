<script lang="ts">
  import { onMount } from 'svelte'
  import Versions from './components/Versions.svelte'
  import { createTRPCProxyClient } from '@trpc/client';
  import { ipcLink } from 'electron-trpc/renderer';
  import superjson from 'superjson';
  import type { AppRouter } from '../../main/api';
  import type { inferRouterOutputs } from '@trpc/server'

  type RouterOutput = inferRouterOutputs<AppRouter>

  let profiles: RouterOutput['aws']['profiles'] = []

  onMount(async () => {
    const client = createTRPCProxyClient<AppRouter>({
      transformer: superjson,
      links: [ipcLink()],
    })

    profiles = await client.aws.profiles.query();
  })

</script>

<div class="container mx-auto">
  <div class="card mt-4 mx-auto max-w-md bg-gradient-to-br variant-gradient-tertiary-secondary">
    <header class="card-header">
      AWS Credentials
    </header>
    <section class="p-4 list-nav">
      <ul>
        {#each profiles as profile}
          <li>
            <a href="#/">
              <span class="badge bg-primary-600">Profile</span>
              <span class="flex-auto">{profile.name}</span>
              <span class="chip variant-filled">{profile.region}</span>
            </a>
          </li>
        {/each}
      </ul>
    </section>
    <!-- <footer class="card-footer">
      <button class="btn btn-primary"></button>
    </footer> -->
  </div>
</div>

<style lang="postcss">

</style>
