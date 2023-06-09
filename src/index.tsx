import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

import { createRoot } from 'react-dom/client';

import { buildMockLocalContext, mockApi } from '@graasp/apps-query-client';

import App from './components/App';
import { ENABLE_MOCK_API, SENTRY_DSN } from './config/constants';
import { SENTRY_ENVIRONMENT, SENTRY_TRACE_SAMPLE_RATE } from './config/sentry';
import buildDatabase from './data/db10Users10Questions';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [new BrowserTracing()],
    environment: SENTRY_ENVIRONMENT,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
  });
}

if (ENABLE_MOCK_API) {
  const appContext = buildMockLocalContext(window.appContext);
  mockApi({
    appContext: window.Cypress ? window.appContext : appContext,
    // database: window.Cypress ? window.database : undefined,
    // enable next line to use mock data
    database: window.Cypress ? window.database : buildDatabase(),
  });
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!);

root.render(<App />);
