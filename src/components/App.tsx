import { I18nextProvider } from 'react-i18next';

import { CircularProgress, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import {
  GraaspContextDevTool,
  WithLocalContext,
  WithTokenContext,
  useObjectState,
} from '@graasp/apps-query-client';

import { ENABLE_MOCK_API } from '../config/constants';
import i18nConfig from '../config/i18n';
import {
  QueryClientProvider,
  ReactQueryDevtools,
  hooks,
  queryClient,
} from '../config/queryClient';
import { mockContext as defaultMockContext } from '../data/config';
import { mockMembers } from '../data/members';
import graaspTheme from '../layout/theme';
import View from './views/View';

export const App = () => {
  const [mockContext, setMockContext] = useObjectState(defaultMockContext);

  const app = (
    <ThemeProvider theme={graaspTheme}>
      <CssBaseline />
      <I18nextProvider i18n={i18nConfig}>
        <QueryClientProvider client={queryClient}>
          <WithLocalContext
            defaultValue={window.Cypress ? window.appContext : mockContext}
            LoadingComponent={<CircularProgress />}
            useGetLocalContext={hooks.useGetLocalContext}
            useAutoResize={hooks.useAutoResize}
            onError={() => {
              console.error('An error occurred while fetching the context.');
            }}
          >
            <WithTokenContext
              LoadingComponent={<CircularProgress />}
              useAuthToken={hooks.useAuthToken}
              onError={() => {
                console.error('An error occurred while requesting the token.');
              }}
            >
              <View />

              {process.env.NODE_ENV === 'development' && ENABLE_MOCK_API && (
                <GraaspContextDevTool
                  members={mockMembers}
                  context={mockContext}
                  setContext={setMockContext}
                />
              )}
            </WithTokenContext>
          </WithLocalContext>

          {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
        </QueryClientProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
  return app;
};

export default App;
