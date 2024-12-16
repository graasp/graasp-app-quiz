import * as Sentry from '@sentry/react';

import { createRoot } from 'react-dom/client';

import { MockSolution, mockApi } from '@graasp/apps-query-client';

import packageConfig from '../package.json';
import App from './components/App';
import { ENABLE_MOCK_API, SENTRY_DSN, SENTRY_ENV } from './config/constants';
import { SENTRY_TRACE_SAMPLE_RATE } from './config/sentry';
import { mockContext } from './data/config';
import buildDatabase from './data/db';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    environment: SENTRY_ENV,
    release: `${packageConfig.name}@${packageConfig.version}`,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: SENTRY_TRACE_SAMPLE_RATE,
  });
}

if (ENABLE_MOCK_API) {
  mockApi(
    {
      externalUrls: [],
      appContext: window.Cypress ? window.appContext : mockContext,
      database: window.Cypress ? window.database : buildDatabase(),
    },
    window.Cypress ? MockSolution.MirageJS : MockSolution.ServiceWorker
  );
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(document.getElementById('root')!);

root.render(<App />);
