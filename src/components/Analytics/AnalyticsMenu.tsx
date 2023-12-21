import groupBy from 'lodash.groupby';

import {
  RefObject,
  SyntheticEvent,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress, Stack, Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { AppSettingData } from '@graasp/apps-query-client';

import { QuestionType } from '../../config/constants';
import { hooks } from '../../config/queryClient';
import {
  ANALYTICS_CONTAINER_CY,
  ANALYTICS_GENERAL_TAB_MENU_CY,
  buildAnalyticsDetailedQuestionTabMenuCy,
} from '../../config/selectors';
import { useElementWidth } from '../../hooks/useElementWidth';
import {
  useMaxAvailableHeightInWindow,
  useMaxAvailableHeightWithParentHeight,
} from '../../hooks/useMaxAvailableHeight';
import { QUIZ_TRANSLATIONS } from '../../langs/constants';
import { getFirstOrUndefined } from '../../utils/array';
import { QuizContext } from '../context/QuizContext';
import AutoScrollableMenu from '../navigation/AutoScrollableMenu';
import TabPanel from '../navigation/TabPanel';
import { Chart, FillTheBlanksAppDataData } from '../types/types';
import {
  fillInTheBlankCharts,
  generalCharts,
  multipleChoicesCharts,
  sliderCharts,
  textInputCharts,
} from './AnalyticsCharts';
import QuestionDetailedCharts from './detailedCharts/QuestionDetailedCharts';
import GeneralCharts from './generalCharts/GeneralCharts';

const SLIDE_BAR_WIDTH = 16;

type Props = {
  headerElem: RefObject<HTMLElement | undefined>;
};

export type ChartRefs = RefObject<{ [key: string]: unknown }>;

/**
 * Component that represents the Analytics menu. Handle which charts have to be drawn.
 *
 * @param headerElem The header element if any, used to calculate the remaining height that this object can take
 * in the window
 */
const AnalyticsMenu = ({ headerElem }: Props): JSX.Element => {
  const { t } = useTranslation();

  // Fetch all the data here, as it is used by multiple children, avoid to fetch it in all children
  const { questions, order } = useContext(QuizContext);
  const { data, isLoading: isContextLoading } = hooks.useAppContext();
  const { data: responses, isLoading } = hooks.useAppData();

  // The charts to display, must contain 'link' and 'label' properties so that they can easily be passed
  // to AutoScrollableMenu component
  const [charts, setCharts] = useState<Chart[]>(generalCharts(t));
  const chartRefs = useRef({});
  const chartContainerRef = useRef(null);
  const [stackElem, setStackElem] = useState<HTMLElement | null>(null);
  const [sideMenuElem, setSideMenuElem] = useState<HTMLElement | null>(null);
  const chartTabs = useRef(null);
  const maxResultViewHeight = useMaxAvailableHeightInWindow(
    headerElem?.current ?? undefined
  );
  const maxHeightScrollableMenu = useMaxAvailableHeightWithParentHeight(
    maxResultViewHeight,
    chartTabs.current ?? undefined
  );
  const [tab, setTab] = useState(0);

  const questionById = useMemo(
    () => groupBy(questions, (q) => q.data.questionId),
    [questions]
  );

  const stackElemWidth = useElementWidth(stackElem);
  const sideMenuElemWidth = useElementWidth(sideMenuElem);

  /**
   * List of question ordered, so that we can easily get the question represented by the index of a tab
   * useful to know the type of the question, to correctly get the charts to display for a question type
   */
  const detailedChartTabQuestion = useMemo(
    () => order.map((qId) => getFirstOrUndefined(questionById, qId)),
    [order, questionById]
  );

  /**
   * Callback to get the charts given the type of the question that has been selected
   */
  const getChartsForType = useCallback(
    (question: AppSettingData) => {
      switch (question?.type) {
        case QuestionType.FILL_BLANKS:
          return fillInTheBlankCharts(t, question as FillTheBlanksAppDataData);
        case QuestionType.SLIDER:
          return sliderCharts(t);
        case QuestionType.TEXT_INPUT:
          return textInputCharts(t);
        case QuestionType.MULTIPLE_CHOICES:
          return multipleChoicesCharts(t);
        default: {
          const errMsg = `The provided question type (${question?.type}) is unknown`;
          console.error(errMsg);
          throw new Error(errMsg);
        }
      }
    },
    [t]
  );

  const getDetailedChartTabQuestion = useCallback(
    (idx: number) => {
      const tab = detailedChartTabQuestion[idx];

      if (!tab) {
        throw new Error(`The tab index ${idx} is out of bound !`);
      }

      return tab;
    },
    [detailedChartTabQuestion]
  );

  /**
   * Callback to handle the tab change, will change the active tab, and correctly set the charts to display
   */
  const handleTabChanged = useCallback(
    (_: SyntheticEvent<Element, Event>, v: number) => {
      if (v === 0) {
        setCharts(generalCharts(t));
      } else {
        const tab = getDetailedChartTabQuestion(v - 1);

        if (!tab) {
          throw new Error(`The tab index ${v - 1} is out of bound !`);
        }

        const charts = getChartsForType(tab.data);
        setCharts(charts);
      }
      setTab(v);
    },
    [t, getDetailedChartTabQuestion, getChartsForType]
  );

  /**
   * When clicking on a chart question in the general section, gets redirected to the corresponding question
   * detailed charts
   */
  const handleQuestionRedirection = useCallback(
    (qId: string) => {
      const index = order.indexOf(qId);

      if (index !== -1) {
        const charts =
          getChartsForType(getDetailedChartTabQuestion(index).data) ??
          generalCharts(t);
        setCharts(charts);
        setTab(index + 1);
      }
    },
    [order, getChartsForType, getDetailedChartTabQuestion, t]
  );

  if (isLoading || isContextLoading) {
    return <CircularProgress />;
  }

  return order.length > 0 ? (
    responses && responses?.length > 0 ? (
      <Box data-cy={ANALYTICS_CONTAINER_CY}>
        <Stack direction="row" ref={(elem) => setStackElem(elem)}>
          <Box
            ref={(elem: HTMLElement) => setSideMenuElem(elem)}
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
                <Tab
                  label={t('General')}
                  data-cy={ANALYTICS_GENERAL_TAB_MENU_CY}
                />
                {order?.map((qId) => {
                  const question = getFirstOrUndefined(questionById, qId)?.data
                    ?.question;

                  if (question) {
                    return (
                      <Tab
                        label={question}
                        key={question}
                        data-cy={buildAnalyticsDetailedQuestionTabMenuCy(
                          question
                        )}
                      />
                    );
                  }

                  return null;
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
              {data ? (
                <GeneralCharts
                  maxWidth={
                    stackElemWidth - sideMenuElemWidth - SLIDE_BAR_WIDTH
                  }
                  generalCharts={generalCharts(t)}
                  chartRefs={chartRefs}
                  goToDetailedQuestion={handleQuestionRedirection}
                  questions={questions}
                  order={order}
                  responses={responses}
                  members={data.members}
                />
              ) : (
                <Typography align="center">
                  {t(QUIZ_TRANSLATIONS.NO_DATA_FOR_GENERAL_CHARTS)}
                </Typography>
              )}
            </TabPanel>
            {order?.map((qId, idx) => {
              const question = getFirstOrUndefined(questionById, qId);
              return question ? (
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
              ) : null;
            })}
          </Box>
        </Stack>
      </Box>
    ) : (
      <Typography align="center" data-cy={ANALYTICS_CONTAINER_CY}>
        {t('No users answered the quiz yet')}
      </Typography>
    )
  ) : (
    <Typography align="center" data-cy={ANALYTICS_CONTAINER_CY}>
      {t("There isn't any question to display")}
    </Typography>
  );
};

export default AnalyticsMenu;
