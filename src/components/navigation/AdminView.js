import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';

import {
  NAVIGATION_ANALYTICS_BUTTON_CY,
  NAVIGATION_CREATE_QUIZ_BUTTON_CY,
  NAVIGATION_RESULT_BUTTON_CY,
  NAVIGATION_TAB_CONTAINER_CY,
} from '../../config/selectors';
import AnalyticsMenu from '../Analytics/AnalyticsMenu';
import CreateView from '../create/CreateView';
import ResultTables from '../results/ResultTables';
import TabPanel from './TabPanel';

const AdminView = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const headerElem = useRef(null);

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}
        ref={headerElem}
      >
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          data-cy={NAVIGATION_TAB_CONTAINER_CY}
        >
          <Tab
            label={t('Create Quiz')}
            data-cy={NAVIGATION_CREATE_QUIZ_BUTTON_CY}
          />
          <Tab label={t('Results')} data-cy={NAVIGATION_RESULT_BUTTON_CY} />
          <Tab
            label={t('Analytics')}
            data-cy={NAVIGATION_ANALYTICS_BUTTON_CY}
          />
        </Tabs>
      </Box>
      <TabPanel tab={tab} index={0}>
        <CreateView />
      </TabPanel>
      <TabPanel tab={tab} index={1}>
        <ResultTables headerElem={headerElem} />
      </TabPanel>
      <TabPanel tab={tab} index={2}>
        <AnalyticsMenu />
      </TabPanel>
    </Box>
  );
};

export default AdminView;
