import type { inferRouterOutputs } from '@trpc/server'
import { createTRPCProxyClient } from '@trpc/client'
import { ipcLink } from 'electron-trpc/renderer'
import superjson from 'superjson'
import { setContext, getContext } from 'svelte'
import type { AppRouter } from '../../../../main/api';

const CONTEXT_KEY = Symbol('context:aws');
let client: ReturnType<typeof createTRPCProxyClient<AppRouter>>;

export type AWSRouterOutputs = inferRouterOutputs<AppRouter>['aws'];
export type AWSRouter = typeof client.aws;

export type AWSContext = {
  aws: AWSRouter;
}

export function setAWSContext() {
  client ??= createTRPCProxyClient<AppRouter>({
    transformer: superjson,
    links: [ipcLink()]
  })

  setContext<AWSContext>(CONTEXT_KEY, {
    aws: client.aws
  });
}

export function getAWSContext() {
  return getContext<AWSContext>(CONTEXT_KEY);
}
