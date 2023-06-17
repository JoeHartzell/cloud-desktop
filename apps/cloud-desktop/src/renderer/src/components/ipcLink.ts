import { Operation, TRPCClientError, TRPCLink } from '@trpc/client';
import type { AnyRouter, inferRouterContext, inferRouterError, ProcedureType } from '@trpc/server';
import type { TRPCResponse, TRPCResponseMessage, TRPCResultMessage } from '@trpc/server/rpc';
import { observable, Observer } from '@trpc/server/observable';
import debug from 'debug';
import type { TRPCClientRuntime } from '@trpc/client'

// from @trpc/client/src/links/internals/transformResult
// FIXME:
// - the generics here are probably unnecessary
// - the RPC-spec could probably be simplified to combine HTTP + WS
/** @internal */
export function transformResult<TRouter extends AnyRouter, TOutput>(
    response:
      | TRPCResponseMessage<TOutput, inferRouterError<TRouter>>
      | TRPCResponse<TOutput, inferRouterError<TRouter>>,
    runtime: TRPCClientRuntime
  ) {
    if ("error" in response) {
      const error = runtime.transformer.deserialize(
        response.error
      ) as inferRouterError<TRouter>;
      return {
        ok: false,
        error: {
          ...response,
          error,
        },
      } as const;
    }

    const result = {
      ...response.result,
      ...((!response.result.type || response.result.type === "data") && {
        type: "data",
        data: runtime.transformer.deserialize(response.result.data) as unknown,
      }),
    } as TRPCResultMessage<TOutput>["result"];
    return { ok: true, result } as const;
  }

export type ETRPCRequest =
  | { method: 'request'; operation: Operation }
  | { method: 'subscription.stop'; id: number };

export interface RendererGlobalElectronTRPC {
  sendMessage: (args: ETRPCRequest) => void;
  onMessage: (callback: (args: TRPCResponseMessage) => void) => void;
}

const log = debug('electron-trpc:renderer:ipcLink');

type IPCCallbackResult<TRouter extends AnyRouter = AnyRouter> = TRPCResponseMessage<
  unknown,
  inferRouterContext<TRouter>
>;

type IPCCallbacks<TRouter extends AnyRouter = AnyRouter> = Observer<
  IPCCallbackResult<TRouter>,
  TRPCClientError<TRouter>
>;

type IPCRequest = {
  type: ProcedureType;
  callbacks: IPCCallbacks;
  op: Operation;
};

const getElectronTRPC = () => {
  console.log(window.electronTRPC)
  const electronTRPC: RendererGlobalElectronTRPC = (window as  any).electronTRPC;

  if (!electronTRPC) {
    throw new Error(
      'Could not find `electronTRPC` global. Check that `exposeElectronTPRC` has been called in your preload file.'
    );
  }

  return electronTRPC;
};

class IPCClient {
  #pendingRequests = new Map<string | number, IPCRequest>();
  #electronTRPC = getElectronTRPC();

  constructor() {
    this.#electronTRPC.onMessage((response: TRPCResponseMessage) => {
      this.#handleResponse(response);
    });
  }

  #handleResponse(response: TRPCResponseMessage) {
    log('handling responses', response);
    log('asdf', this.#pendingRequests)
    const request = response.id && this.#pendingRequests.get(response.id);
    if (!request) {
      return;
    }

    request.callbacks.next(response);

    if ('result' in response && response.result.type === 'stopped') {
      request.callbacks.complete();
    }
  }

  request(op: Operation, callbacks: IPCCallbacks) {
    const { type, id } = op;

    this.#pendingRequests.set(id, {
      type,
      callbacks,
      op,
    });

    this.#electronTRPC.sendMessage({ method: 'request', operation: op });

    return () => {
      const callbacks = this.#pendingRequests.get(id)?.callbacks;

      this.#pendingRequests.delete(id);

      callbacks?.complete();

      if (type === 'subscription') {
        this.#electronTRPC.sendMessage({
          id,
          method: 'subscription.stop',
        });
      }
    };
  }
}

export function ipcLink<TRouter extends AnyRouter>(): TRPCLink<TRouter> {
  return (runtime) => {
    const client = new IPCClient();

    return ({ op }) => {
      return observable((observer) => {
        op.input = runtime.transformer.serialize(op.input);

        let isDone = false;
        const unsubscribe = client.request(op, {
          error(err) {
            isDone = true;
            observer.error(err as TRPCClientError<any>);
            unsubscribe();
          },
          complete() {
            if (!isDone) {
              isDone = true;
              observer.error(TRPCClientError.from(new Error('Operation ended prematurely')));
            } else {
              observer.complete();
            }
          },
          next(response) {
            const transformed = transformResult(response, runtime);

            if (!transformed.ok) {
              observer.error(TRPCClientError.from(transformed.error));
              return;
            }

            observer.next({ result: transformed.result });

            if (op.type !== 'subscription') {
              isDone = true;
              unsubscribe();
              observer.complete();
            }
          },
        });

        return () => {
          isDone = true;
          unsubscribe();
        };
      });
    };
  };
}
