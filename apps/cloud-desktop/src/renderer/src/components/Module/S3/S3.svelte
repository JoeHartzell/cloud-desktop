<script lang="ts">
  import { onMount } from 'svelte'
  import { getAWSContext } from '../../../context/AWS'

  export let params = {}

  const { aws } = getAWSContext()

  onMount(async () => {
    const profiles = await aws.profiles.query()
    console.log(profiles)
  })
</script>
