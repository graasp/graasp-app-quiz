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

import { QUESTION_TYPES } from '../../config/constants';
import { useElementWidth } from '../../hooks/useElementWidth';
import {
  useMaxAvailableHeightInWindow,
  useMaxAvailableHeightWithParentHeight,
} from '../../hooks/useMaxAvailableHeight';
import { QuizContext } from '../context/QuizContext';
import AutoScrollableMenu from '../navigation/AutoScrollableMenu';
import TabPanel from '../navigation/TabPanel';
import {
  fillInTheBlankCharts,
  generalCharts,
  multipleChoicesCharts,
  sliderCharts,
  textInputCharts,
} from './AnalyticsCharts';
import QuestionDetailedCharts from './detailedCharts/QuestionDetailedCharts';
import GeneralCharts from './genaralCharts/GeneralCharts';

const SLIDER_WIDTH = 16;

/**
 * Component that represents the Analytics menu. Handle which charts have to be drawn.
 *
 * @param headerElem The header element if any, used to calculate the remaining height that this object can take
 * in the window
 */
const AnalyticsMenu = ({ headerElem }) => {
  const { t } = useTranslation();

  // The charts to display, must contain 'link' and 'label' properties so that they can easily be passed
  // to AutoScrollableMenu component
  const [charts, setCharts] = useState(generalCharts(t));
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

  const questionById = useMemo(
    () => questions.groupBy((q) => q.id),
    [questions]
  );

  // Here to force react to trigger a re-render when stackElemRef.current has been modified
  useEffect(() => {
    setStackElem(stackElemRef.current);
  }, []);
  useEffect(() => {
    setSideMenuElem(sideMenuElemRef.current);
  }, []);

  const stackElemWidth = useElementWidth(stackElem);
  const sideMenuElemWidth = useElementWidth(sideMenuElem);

  /**
   * List of question ordered, so that we can easily get the question represented by the index of a tab
   * useful to know the type of the question, to correctly get the charts to display for a question type
   */
  const detailedChartTabQuestion = useMemo(
    () => order.map((qId) => questionById.get(qId)?.first()),
    [order, questionById]
  );

  /**
   * Callback to get the charts given the type of the question that has been selected
   */
  const getChartsForType = useCallback(
    (question) => {
      // eslint-disable-next-line default-case
      switch (question?.data?.type) {
        case QUESTION_TYPES.FILL_BLANKS:
          return fillInTheBlankCharts(t, question);
        case QUESTION_TYPES.SLIDER:
          return sliderCharts(t);
        case QUESTION_TYPES.TEXT_INPUT:
          return textInputCharts(t);
        case QUESTION_TYPES.MULTIPLE_CHOICES:
          return multipleChoicesCharts(t);
      }
    },
    [t]
  );

  /**
   * Callback to handle the tab change, will change the active tab, and correctly set the charts to display
   */
  const handleTabChanged = useCallback(
    (_, v) => {
      if (v === 0) {
        setCharts(generalCharts(t));
      } else {
        setCharts(getChartsForType(detailedChartTabQuestion[v - 1]));
      }
      setTab(v);
    },
    [getChartsForType, detailedChartTabQuestion, t]
  );

  /**
   * When clicking on a chart question in the general section, gets redirected to the corresponding question
   * detailed charts
   */
  const handleQuestionRedirection = useCallback(
    (qId) => {
      const index = order.indexOf(qId);
      if (index !== -1) {
        setCharts(getChartsForType(detailedChartTabQuestion[index]));
        setTab(index + 1);
      }
    },
    [order, detailedChartTabQuestion, getChartsForType]
  );

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
              links={charts}
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
              generalCharts={generalCharts(t)}
              chartRefs={chartRefs}
              goToDetailedQuestion={handleQuestionRedirection}
            />
          </TabPanel>
          {order?.map((qId, idx) => {
            const question = questionById.get(qId)?.first();
            return (
              // The +1 is here to account for the General tab, that is at index 0
              <TabPanel tab={tab} index={idx + 1} key={qId}>
                <QuestionDetailedCharts
                  maxWidth={stackElemWidth - sideMenuElemWidth - SLIDER_WIDTH}
                  detailedCharts={charts}
                  chartRefs={chartRefs}
                  question={question}
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
