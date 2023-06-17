<script lang="ts">
  import { onMount } from "svelte"
  import Icon from "@iconify/svelte"
  import { getAWSContext } from "../../../context/AWS";
  import type { AWSRouterOutputs } from '../../../context/AWS/aws.context'

  let profiles: AWSRouterOutputs['profiles'] = [];
  const { aws } = getAWSContext();

  onMount(async () => {
    profiles = await aws.profiles.query();
  })
</script>

<div class="card mt-4 mx-auto max-w-md bg-gradient-to-br variant-gradient-tertiary-secondary">
  <header class="card-header">
    <h4 class="flex justify-center items-center h4">
      <Icon icon="mdi:aws" class="h-10 w-10"/>
      <span class="m-2 pb-1">Credentials</span>
    </h4>
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
</div>
