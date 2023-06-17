<script lang="ts">
  import { type CreateTRPCProxyClient, createTRPCProxyClient } from "@trpc/client"
  // import { ipcLink } from "electron-trpc/renderer"
  import { ipcLink } from './ipcLink'
  import { onMount } from "svelte"
  import type { AppRouter } from "../../../main/api"
  import type { inferRouterOutputs } from "@trpc/server"
  import superjson from "superjson"


  type RouterOutput = inferRouterOutputs<AppRouter>

  let client: CreateTRPCProxyClient<AppRouter>;
  let profiles: RouterOutput['aws']['profiles'] = []
  // let credentials: typeof profiles[number];

  onMount(async () => {


        setTimeout(async () => {
          try {
            const c = createTRPCProxyClient<AppRouter>({
              transformer: superjson,
              links: [ipcLink()],
            });

            (window.electronTRPC as any).onMessage((response) => {
              console.log('response', response)
            })


            profiles = await c.aws.profiles.query();
            // console.log('done')
            }
          catch (error) {
            console.log(error)
          }
        }, 1000);



  })
</script>

<h1 class="h1">Hello?</h1>
<ul>
  {#each profiles as profile}
    <li>{profile.name}</li>
  {/each}
</ul>
