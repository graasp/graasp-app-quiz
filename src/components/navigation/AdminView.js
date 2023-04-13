import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';

import {
  NAVIGATION_CREATE_QUIZ_BUTTON_CY,
  NAVIGATION_RESULT_BUTTON_CY,
  NAVIGATION_TAB_CONTAINER_CY,
} from '../../config/selectors';
import CreateView from '../create/CreateView';
import ResultTables from '../results/ResultTables';

const AdminView = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const TabPanel = ({ children, tab, index }) => {
    return tab === index && <Box sx={{ pt: 4 }}>{children}</Box>;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
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
        </Tabs>
      </Box>
      <TabPanel tab={tab} index={0}>
        <CreateView />
      </TabPanel>
      <TabPanel tab={tab} index={1}>
        <ResultTables />
      </TabPanel>
    </Box>
  );
};

export default AdminView;