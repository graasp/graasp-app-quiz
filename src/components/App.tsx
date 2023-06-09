import React from 'react';
import { I18nextProvider } from 'react-i18next';

import { CircularProgress } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import { withContext, withToken } from '@graasp/apps-query-client';

import i18nConfig from '../config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  hooks,
  queryClient,
} from '../config/queryClient';
import graaspTheme from '../layout/theme';
import View from './views/View';

export const App = () => {
  const AppWithContext = withToken(View, {
    LoadingComponent: <CircularProgress />,
    useAuthToken: hooks.useAuthToken,
    onError: () => {
      console.log('An error occured while requesting the token.');
    },
  });

  const AppWithContextAndToken = withContext(AppWithContext, {
    LoadingComponent: <CircularProgress />,
    useGetLocalContext: hooks.useGetLocalContext,
    useAutoResize: hooks.useAutoResize,
    onError: () => {
      console.log('An error occured while fetching the context.');
    },
  });

  const app = (
    <ThemeProvider theme={graaspTheme}>
      <I18nextProvider i18n={i18nConfig}>
        <QueryClientProvider client={queryClient}>
          <AppWithContextAndToken />
          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </QueryClientProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
  return app;
};

export default App;
