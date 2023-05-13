import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';

import { useElementWidth } from '../../hooks/useElementWidth';
import TabPanel from '../navigation/TabPanel';
import QuestionDifficulty from './QuestionDifficulty';

const AnalyticsMenu = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const stackElemRef = useRef(null);
  const sideMenuElemRef = useRef(null);
  const [stackElem, setStackElem] = useState(null);
  const [sideMenuElem, setSideMenuElem] = useState(null);

  // Here to force react to trigger a re-render when stackElemRef.current has been modified
  useEffect(() => {
    setStackElem(stackElemRef.current);
  }, []);
  useEffect(() => {
    setSideMenuElem(sideMenuElemRef.current);
  }, []);

  const stackElemWidth = useElementWidth(stackElem);
  const sideMenuElemWidth = useElementWidth(sideMenuElem);

  // TODO change Tabs into AutoScrollableMenu
  return (
    <Box>
      <Stack direction="row" spacing={5} ref={stackElemRef}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          orientation="vertical"
          ref={sideMenuElemRef}
          sx={{ minWidth: '8em' }}
        >
          <Tab label={t('Question correctness')} />
          <Tab label={t('Question completion rate')} />
        </Tabs>
        <TabPanel tab={tab} index={0}>
          <QuestionDifficulty maxWidth={stackElemWidth - sideMenuElemWidth} />
        </TabPanel>
        <TabPanel tab={tab} index={1}>
          Placeholder future chart
        </TabPanel>
      </Stack>
    </Box>
  );
};

export default AnalyticsMenu;
