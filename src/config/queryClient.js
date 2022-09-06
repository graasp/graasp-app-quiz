import {
  buildMockLocalContext,
  buildMockParentWindow,
  configureQueryClient,
} from '@graasp/apps-query-client';

import { ENABLE_MOCK_API, REACT_APP_GRAASP_APP_ID } from './constants';
import notifier from './notifier';

const {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  ReactQueryDevtools,
  API_ROUTES,
  MUTATION_KEYS,
  QUERY_KEYS,
  useQuery,
} = configureQueryClient({
  notifier,
  keepPreviousData: true,
  // avoid refetching when same data are closely fetched
  staleTime: 1000, // ms
  GRAASP_APP_ID: REACT_APP_GRAASP_APP_ID,
  targetWindow: ENABLE_MOCK_API // build mock parent window given cypress context or mock data
    ? buildMockParentWindow(buildMockLocalContext(window.appContext))
    : window.parent,
});

export {
  queryClient,
  QueryClientProvider,
  hooks,
  useMutation,
  ReactQueryDevtools,
  API_ROUTES,
  MUTATION_KEYS,
  QUERY_KEYS,
  useQuery,
};
