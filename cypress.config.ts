import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    retries: {
      runMode: 2,
    },
    setupNodeEvents(on, config) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('@cypress/code-coverage/task')(on, config);
      // include any other plugin code...

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config;
    },
    baseUrl: 'http://localhost:3000',
  },
  env: {
    REACT_APP_GRAASP_DOMAIN: process.env.REACT_APP_GRAASP_DOMAIN,
    REACT_APP_API_HOST: process.env.REACT_APP_API_HOST,
    REACT_APP_ENABLE_MOCK_API: process.env.REACT_APP_ENABLE_MOCK_API,
    REACT_APP_GRAASP_APP_KEY: process.env.REACT_APP_GRAASP_APP_KEY,
  },
});
