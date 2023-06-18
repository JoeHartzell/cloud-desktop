<script lang="ts">
  import { AppBar } from '@skeletonlabs/skeleton'
  import Icon from '@iconify/svelte'
</script>

<AppBar background="variant-gradient-primary-secondary bg-gradient-to-br" class="shadow-md">
  <svelte:fragment slot="lead">Cloud Desktop</svelte:fragment>
  <svelte:fragment slot="trail">
    <button class="btn-icon variant-filled">
      <Icon icon="mdi:settings-outline" class="w-6 h-6 inline" />
    </button>
  </svelte:fragment>
</AppBar>
