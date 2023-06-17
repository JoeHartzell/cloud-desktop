import { createHash } from 'crypto';
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'
import type { AwsCredentialIdentity } from '@aws-sdk/types';
import { loadSharedConfigFiles } from '@aws-sdk/shared-ini-file-loader'
import { fromIni } from '@aws-sdk/credential-providers';
import { BrowserWindow, WebFrameMain } from 'electron';
import { CreateContextOptions } from 'electron-trpc/main';
import z from 'zod';

type Context = {
  currentWindowId: BrowserWindow['id'];
  credentials: Map<WebFrameMain['routingId'], AwsCredentialIdentity>;
}

const credentials = new Map<WebFrameMain['routingId'], AwsCredentialIdentity>();
export const createContext = () => async (opts: CreateContextOptions): Promise<Context> => {
  return {
    currentWindowId: opts.event.senderFrame.routingId,
    credentials
  }
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const router = t.router;
const publicProcedure = t.procedure;

const s3 = router({
  listBuckets: publicProcedure.query(async ({ ctx }) => {
    // list s3 buckets using the @aws-sdk/client-s3
    console.log(ctx.credentials);
    const client = new S3Client({
      credentials: ctx.credentials.get(ctx.currentWindowId),
    });
    const buckets = await client.send(new ListBucketsCommand({}));
    return buckets;
  })

})

const aws = router({
  s3,

  updateCredentials: publicProcedure.input(z.object({
    profile: z.string(),
  })).mutation(async ({ ctx, input }) => {
    const credentials = fromIni({ profile: input.profile });
    ctx.credentials = ctx.credentials.set(ctx.currentWindowId, await credentials());

    console.log(ctx.credentials.get(ctx.currentWindowId));
  }),

  getCredentials: publicProcedure.query(async ({ ctx }) => {
    return ctx.credentials.get(ctx.currentWindowId);
  }),

  profiles: publicProcedure.query(async () => {
    const profiles = await loadSharedConfigFiles();
    console.log(profiles);
    return Object.entries(profiles.configFile).map(([key, value]) => {
      return {
        id: createHash('sha256').update(key).digest('base64'),
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
