import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { loadSharedConfigFiles } from '@aws-sdk/shared-ini-file-loader'

const t = initTRPC.create({
  transformer: superjson,
});

const router = t.router;
const publicProcedure = t.procedure;

const aws = router({
  profiles: publicProcedure.query(async () => {
    const profiles = await loadSharedConfigFiles();
    console.log(profiles);
    return Object.entries(profiles.configFile).map(([key, value]) => {
      return {
        name: key,
        region: value.region,
      };
    })

  })
})

export const appRouter = router({
  aws
})

export type AppRouter = typeof appRouter;
