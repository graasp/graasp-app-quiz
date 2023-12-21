import { Database } from '@graasp/apps-query-client';

import { mockAppData, mockAppSetting } from './config';
import { mockItems } from './items';
import { mockMembers } from './members';

/**
 * This database contains 10 questions, with 10 mock users, help display more data, to better see tables and charts
 */
const buildDatabase = (): Database => ({
  appData: mockAppData,
  appSettings: mockAppSetting,
  members: mockMembers,
  appActions: [],
  items: mockItems,
});

export default buildDatabase;
