import { QueryClient } from "@tanstack/react-query";

const DAY = 1000 * 60 * 60 * 24;

/**
 * Outer bound on how long query data survives in AsyncStorage. Anything older is
 * dropped on restore. Per query, the effective lifetime is the smaller of this and
 * the query's `gcTime`: the persister only stores what is still in memory, so a
 * query that is garbage collected disappears from storage on the next write.
 *
 * The default `gcTime` below is one day; apps/firan-app/src/index.ts raises it to
 * this bound for the account and billing endpoints a returning customer should
 * see straight away, and leaves the parameterised consumption queries (one cache
 * entry per period browsed) at a day so they do not pile up. Freshness is a
 * separate axis: the per-endpoint staleTimes there decide how soon kept data
 * refetches.
 */
export const CACHE_MAX_AGE = 7 * DAY;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: DAY,
      refetchOnReconnect: true,
    },
  },
});

// export const asyncStoragePersister: Persister = createAsyncStoragePersister({
//   storage: AsyncStorage,
// });

/**
 * Options for `PersistQueryClientProvider`. `maxAge` must match `gcTime`: the
 * persister's own default is 24 hours, which would silently discard anything
 * older on restore regardless of how long the QueryClient keeps it.
 */
// export const persistOptions = {
//   persister: asyncStoragePersister,
//   maxAge: CACHE_MAX_AGE,
// };
