import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Stack } from '@mui/material';
import Box from '@mui/material/Box';

import { useElementWidth } from '../../hooks/useElementWidth';
import { useMaxAvailableHeightInWindow } from '../../hooks/useMaxAvailableHeight';
import { formatInnerLink } from '../../utils/tableUtils';
import AutoScrollableMenu from '../navigation/AutoScrollableMenu';
import CorrectResponsePerUser from './CorrectResponsePerUser';
import QuestionDifficulty from './QuestionDifficulty';

const SLIDER_WIDTH = 16;

const AnalyticsMenu = ({ headerElem }) => {
  const { t } = useTranslation();

  const chartRefs = useRef({});
  const chartContainerRef = useRef(null);
  const stackElemRef = useRef(null);
  const sideMenuElemRef = useRef(null);
  const [stackElem, setStackElem] = useState(null);
  const [sideMenuElem, setSideMenuElem] = useState(null);
  const maxResultViewHeight = useMaxAvailableHeightInWindow(headerElem.current);

  // Here to force react to trigger a re-render when stackElemRef.current has been modified
  useEffect(() => {
    setStackElem(stackElemRef.current);
  }, []);
  useEffect(() => {
    setSideMenuElem(sideMenuElemRef.current);
  }, []);

  const stackElemWidth = useElementWidth(stackElem);
  const sideMenuElemWidth = useElementWidth(sideMenuElem);

  const menuLabels = [
    t('Quiz performance'),
    t('Users performance') /*t('Quiz completion rate')*/,
  ].map((val) => {
    return {
      label: val,
      link: formatInnerLink(val),
    };
  });

  return (
    <Box>
      <Stack direction="row" ref={stackElemRef}>
        <Box
          ref={sideMenuElemRef}
          sx={{ minWidth: '8em', maxHeight: maxResultViewHeight }}
        >
          <AutoScrollableMenu
            links={menuLabels}
            elemRefs={chartRefs}
            containerRef={chartContainerRef}
          />
        </Box>
        <Box
          sx={{
            overflow: 'auto',
            width: '100%',
            height: maxResultViewHeight,
            scrollBehavior: 'smooth',
          }}
          ref={chartContainerRef}
        >
          <Box
            ref={(elm) => (chartRefs.current[menuLabels[0].label] = elm)}
            id={menuLabels[0].link}
          >
            <QuestionDifficulty
              maxWidth={stackElemWidth - sideMenuElemWidth - SLIDER_WIDTH}
            />
          </Box>
          <Box
            ref={(elm) => (chartRefs.current[menuLabels[1].label] = elm)}
            id={menuLabels[1].link}
          >
            <CorrectResponsePerUser
              maxWidth={stackElemWidth - sideMenuElemWidth - SLIDER_WIDTH}
            />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
};

export default AnalyticsMenu;
