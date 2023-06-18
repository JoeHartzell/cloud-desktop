<script lang="ts">
  import { onMount } from 'svelte'
  import { getAWSContext } from '../context/AWS'
  import type { AWSRouterOutputs } from '../context/AWS'

  const { aws } = getAWSContext()
  let profiles: AWSRouterOutputs['profiles'] = []

  onMount(async () => {
    profiles = await aws.profiles.query()
  })
</script>

<h1 class="h1">Hello?</h1>
<ul>
  {#each profiles as profile}
    <li>{profile.name}</li>
  {/each}
</ul>
