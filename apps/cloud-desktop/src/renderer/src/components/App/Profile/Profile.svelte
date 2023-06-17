<script lang="ts">
  import { pop } from 'svelte-spa-router'
  import { getAppContext } from '../../../context/App'

  export let params: { id?: string } = {}

  const { profiles, setCurrentProfile } = getAppContext()

  $: if (params.id) {
    setCurrentProfile(params.id)
  }
</script>

{params.id}

<button class="btn btn-primary" on:click={() => pop()}>Back</button>
