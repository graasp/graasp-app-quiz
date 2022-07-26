import { createRoot } from 'react-dom/client';

import { buildMockLocalContext, mockApi } from '@graasp/apps-query-client';

import App from './components/App';
import { ENABLE_MOCK_API } from './config/constants';

if (ENABLE_MOCK_API) {
  const appContext = buildMockLocalContext(window.appContext);
  // automatically append item id as a query string
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.get('itemId')) {
    searchParams.set('itemId', appContext.itemId);
    window.location.search = searchParams.toString();
  }
  mockApi({
    appContext: window.Cypress ? window.appContext : appContext,
    database: window.Cypress ? window.database : undefined,
    // enable next line to use mock data
    // database: window.Cypress ? window.database : buildDatabase(appContext),
  });
}

const root = createRoot(document.getElementById('root'));

const renderApp = (Component) => {
  root.render(<Component />);
};

// render app to the dom
renderApp(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    // eslint-disable-next-line global-require
    const NextRoot = require('./components/App').default;
    renderApp(NextRoot);
  });
}
