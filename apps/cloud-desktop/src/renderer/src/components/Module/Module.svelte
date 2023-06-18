<script lang="ts">
  import Router from 'svelte-spa-router'
  import { S3 } from './S3'

  const random = Math.random()

  const prefix = '/module'
  const routes = {
    '/s3/:session': S3,
  }
</script>

<Router {prefix} {routes} />

<h1 class="h1">Module</h1>
<p>Random: {random}</p>
