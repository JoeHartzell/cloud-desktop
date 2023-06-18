<script lang="ts">
  import { pop } from 'svelte-spa-router'
  import { getAppContext } from '../../../context/App'
  import IFrame from '../../IFrame.svelte'
  import { AppBar } from '@skeletonlabs/skeleton'
  import Icon from '@iconify/svelte'

  export let params: { id?: string } = {}

  const { setCurrentSession, currentSession } = getAppContext()

  $: if (params.id) {
    setCurrentSession(params.id)
  }

  const setActiveModule = (id: string) => {
    $currentSession?.modules.setActive(id)
  }

  const clearActiveModule = () => {
    $currentSession?.modules.clearActive()
  }

  $: sessionModules = $currentSession?.modules.all
  $: activeModule = $currentSession?.modules.active
</script>

<div>
  <AppBar background="bg-surface-600">
    <svelte:fragment slot="lead">
      <div class="flex justify-stretch items-center gap-1">
        {#each $sessionModules ?? [] as item (item.id)}
          <button
            on:click={() => setActiveModule(item.id)}
            class:variant-ghost-primary={item.id !== $activeModule?.id}
            class:variant-filled-primary={item.id === $activeModule?.id}
            class="chip">{item.name}</button
          >
        {/each}
      </div>
    </svelte:fragment>

    <svelte:fragment slot="trail">
      <button class="btn-icon btn-icon-md variant-filled" on:click={() => clearActiveModule()}
        ><Icon icon="mdi:add-bold" class="w-6 h-6 inline" /></button
      >
    </svelte:fragment>
  </AppBar>
  <!--
  <button class="btn btn-primary" on:click={() => pop()}>Back</button> -->

  {#each $sessionModules ?? [] as item (item.id)}
    <iframe
      src={`#/module/${item.name}/${$currentSession.id}`}
      class:hidden={item.id !== $activeModule?.id}
    />
  {/each}

  {#if $activeModule === null}
    <div class="logo-cloud grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6 gap-0.5 p-2">
      <a on:click={() => $currentSession.modules.add('S3')} class="logo-item">S3</a>
      <a on:click={() => $currentSession.modules.add('ECS')} class="logo-item">ECS</a>
      <a href="/elements/logo-clouds" class="logo-item">Lambda</a>
      <a href="/elements/logo-clouds" class="logo-item">Api Gateway</a>
    </div>
  {/if}
</div>
