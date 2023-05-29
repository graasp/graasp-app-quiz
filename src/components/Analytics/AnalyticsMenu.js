import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress, Stack, Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { QUESTION_TYPES } from '../../config/constants';
import { hooks } from '../../config/queryClient';
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

const SLIDE_BAR_WIDTH = 16;

/**
 * Component that represents the Analytics menu. Handle which charts have to be drawn.
 *
 * @param headerElem The header element if any, used to calculate the remaining height that this object can take
 * in the window
 */
const AnalyticsMenu = ({ headerElem }) => {
  const { t } = useTranslation();

  // Fetch all the data here, as it is used by multiple children, avoid to fetch it in all children
  const { questions, order } = useContext(QuizContext);
  const { data, isLoading: isContextLoading } = hooks.useAppContext();
  const { data: responses, isLoading } = hooks.useAppData();

  // The charts to display, must contain 'link' and 'label' properties so that they can easily be passed
  // to AutoScrollableMenu component
  const [charts, setCharts] = useState(generalCharts(t));
  const chartRefs = useRef({});
  const chartContainerRef = useRef(null);
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

  if (isLoading || isContextLoading) {
    return <CircularProgress />;
  }

  return order.length > 0 ? (
    responses.size > 0 ? (
      <Box>
        <Stack direction="row" ref={(elem) => setStackElem(elem)}>
          <Box
            ref={(elem) => setSideMenuElem(elem)}
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
                  const question = questionById.get(qId)?.first()
                    ?.data?.question;
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
                maxWidth={stackElemWidth - sideMenuElemWidth - SLIDE_BAR_WIDTH}
                generalCharts={generalCharts(t)}
                chartRefs={chartRefs}
                goToDetailedQuestion={handleQuestionRedirection}
                questions={questions}
                order={order}
                responses={responses}
                members={data?.members}
              />
            </TabPanel>
            {order?.map((qId, idx) => {
              const question = questionById.get(qId)?.first();
              return (
                // The +1 is here to account for the General tab, that is at index 0
                <TabPanel tab={tab} index={idx + 1} key={qId}>
                  <QuestionDetailedCharts
                    maxWidth={
                      stackElemWidth - sideMenuElemWidth - SLIDE_BAR_WIDTH
                    }
                    detailedCharts={charts}
                    chartRefs={chartRefs}
                    question={question}
                    responses={responses}
                  />
                </TabPanel>
              );
            })}
          </Box>
        </Stack>
      </Box>
    ) : (
      <Typography align="center">
        {t('No users answered the quiz yet')}
      </Typography>
    )
  ) : (
    <Typography align="center">
      {t("There isn't any question to display")}
    </Typography>
  );
};

export default AnalyticsMenu;
