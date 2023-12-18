import { useTranslation } from 'react-i18next';

import { Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';

import {
  RESULT_TABLES_RESULT_BY_QUESTION_BUTTON_CY,
  RESULT_TABLES_RESULT_BY_USER_BUTTON_CY,
  RESULT_TABLES_TAB_CONTAINERS_CY,
} from '../../config/selectors';
import { MutableRefObject } from 'react';

type Props = {
  tab: number;
  tableMenuElem: MutableRefObject<HTMLElement | undefined>;
  setTab: (tabIdx: number) => void;
}

/**
 *
 * @param {number} tab The tab index currently selected
 * @param {(number) => void} setTab A function to update the selected index upon new selection
 * @param {MutableRefObject<HTMLElement>} tableMenuElem A ref object in which to set the reference of the
 * resultTableMenu html element. Need to be forwarded, as it is not possible to call ref={} on custom component.
 */
const ResultTablesMenu = ({ tab, setTab, tableMenuElem }: Props) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}
      ref={tableMenuElem}
    >
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        orientation="vertical"
        data-cy={RESULT_TABLES_TAB_CONTAINERS_CY}
      >
        <Tab
          label={t('Results by question')}
          data-cy={RESULT_TABLES_RESULT_BY_QUESTION_BUTTON_CY}
        />
        <Tab
          label={t('Results by user')}
          data-cy={RESULT_TABLES_RESULT_BY_USER_BUTTON_CY}
        />
      </Tabs>
    </Box>
  );
};

export default ResultTablesMenu;
