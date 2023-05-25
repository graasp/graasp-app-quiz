import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Stack, Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';

import { useElementWidth } from '../../hooks/useElementWidth';
import {
  useMaxAvailableHeightInWindow,
  useMaxAvailableHeightWithParentHeight,
} from '../../hooks/useMaxAvailableHeight';
import { formatInnerLink } from '../../utils/tableUtils';
import { QuizContext } from '../context/QuizContext';
import AutoScrollableMenu from '../navigation/AutoScrollableMenu';
import TabPanel from '../navigation/TabPanel';
import QuestionDetailedCharts from './detailedCharts/QuestionDetailedCharts';
import GeneralCharts from './genaralCharts/GeneralCharts';

const SLIDER_WIDTH = 16;

const AnalyticsMenu = ({ headerElem }) => {
  const { t } = useTranslation();

  const generalMenuLabels = useMemo(() => {
    return [
      t('Quiz performance'),
      t('Users performance'),
      t('Quiz correct response percentage'),
    ].map((val) => {
      return {
        label: val,
        link: formatInnerLink(val),
      };
    });
  }, [t]);

  const questionDetailedMenuLabels = useMemo(() => {
    return [t('Question answer frequency')].map((val) => {
      return {
        label: val,
        link: formatInnerLink(val),
      };
    });
  }, [t]);

  const [autoScrollableMenuLinks, setAutoScrollableMenuLinks] =
    useState(generalMenuLabels);
  const { questions, order } = useContext(QuizContext);
  const chartRefs = useRef({});
  const chartContainerRef = useRef(null);
  const stackElemRef = useRef(null);
  const sideMenuElemRef = useRef(null);
  const [stackElem, setStackElem] = useState(null);
  const [sideMenuElem, setSideMenuElem] = useState(null);
  const chartTabs = useRef(null);
  const maxResultViewHeight = useMaxAvailableHeightInWindow(headerElem.current);
  const maxHeightScrollableMenu = useMaxAvailableHeightWithParentHeight(
    maxResultViewHeight,
    chartTabs.current
  );
  const [tab, setTab] = useState(0);

  const getQuestionById = useCallback(() => {
    return questions.groupBy((q) => q.id);
  }, [questions]);

  const [questionById, setQuestionById] = useState(getQuestionById());

  useEffect(() => {
    setQuestionById(getQuestionById());
  }, [getQuestionById]);

  // Here to force react to trigger a re-render when stackElemRef.current has been modified
  useEffect(() => {
    setStackElem(stackElemRef.current);
  }, []);
  useEffect(() => {
    setSideMenuElem(sideMenuElemRef.current);
  }, []);

  const stackElemWidth = useElementWidth(stackElem);
  const sideMenuElemWidth = useElementWidth(sideMenuElem);

  const handleTabChanged = (_, v) => {
    if (v === 0) {
      setAutoScrollableMenuLinks(generalMenuLabels);
    } else {
      setAutoScrollableMenuLinks(questionDetailedMenuLabels);
    }
    setTab(v);
  };

  const handleQuestionRedirection = (qId) => {
    const index = order.indexOf(qId);
    if (index !== -1) {
      setTab(order.indexOf(qId) + 1);
    }
  };

  return (
    <Box>
      <Stack direction="row" ref={stackElemRef}>
        <Box
          ref={sideMenuElemRef}
          sx={{
            minWidth: '8em',
            maxWidth: '12em',
            maxHeight: maxResultViewHeight,
          }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 4,
              maxHeight: maxResultViewHeight / 2,
              overflow: 'auto',
            }}
            ref={chartTabs}
          >
            <Tabs
              value={tab}
              onChange={handleTabChanged}
              orientation="vertical"
            >
              <Tab label={t('General')} />
              {order?.map((qId) => {
                const question = questionById.get(qId)?.first()?.data?.question;
                return <Tab label={question} key={question} />;
              })}
            </Tabs>
          </Box>
          <Box sx={{ maxHeight: maxHeightScrollableMenu, overflow: 'auto' }}>
            <AutoScrollableMenu
              links={autoScrollableMenuLinks}
              elemRefs={chartRefs}
              containerRef={chartContainerRef}
              triggerVal={tab}
            />
          </Box>
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
          <TabPanel tab={tab} index={0}>
            <GeneralCharts
              maxWidth={stackElemWidth - sideMenuElemWidth - SLIDER_WIDTH}
              generalMenuLabels={generalMenuLabels}
              chartRefs={chartRefs}
              goToDetailedQuestion={handleQuestionRedirection}
            />
          </TabPanel>
          {order?.map((qId, idx) => {
            return (
              <TabPanel tab={tab} index={idx + 1} key={qId}>
                <QuestionDetailedCharts
                  maxWidth={stackElemWidth - sideMenuElemWidth - SLIDER_WIDTH}
                  questionDetailedMenuLabels={questionDetailedMenuLabels}
                  chartRefs={chartRefs}
                  question={questionById.get(qId)?.first()}
                />
              </TabPanel>
            );
          })}
        </Box>
      </Stack>
    </Box>
  );
};

export default AnalyticsMenu;
