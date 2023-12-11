import {
  configureQueryClient,
} from '@graasp/apps-query-client';

import { API_HOST, ENABLE_MOCK_API, GRAASP_APP_KEY } from './constants';
import notifier from './notifier';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  API_ROUTES,
  QUERY_KEYS,
  useQuery,
  mutations,
} = configureQueryClient({
  notifier,
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  GRAASP_APP_KEY,
  isStandalone: ENABLE_MOCK_API,
  API_HOST,
});

export {
  queryClient,
  QueryClientProvider,
  hooks,
  ReactQueryDevtools,
  API_ROUTES,
  QUERY_KEYS,
  useQuery,
  mutations,
};
