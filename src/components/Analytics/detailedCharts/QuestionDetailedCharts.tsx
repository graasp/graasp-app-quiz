import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { AppData } from '@graasp/sdk';

import { QuestionType } from '../../../config/constants';
import { buildAnalyticsDetailedChartCy } from '../../../config/selectors';
import { getAllAppDataByQuestionId } from '../../context/utilities';
import {
  Chart,
  FillTheBlanksAppDataData,
  MultipleChoiceAppDataData,
  MultipleRefs,
  QuestionDataAppSetting,
  SliderAppDataData,
  TextAppDataData,
} from '../../types/types';
import { DetailedChartType } from '../AnalyticsCharts';
import AnswersDistributionFillInTheBlanks from './answersDistribution/AnswersDistributionFillInTheBlanks';
import AnswersDistributionMultipleChoices from './answersDistribution/AnswersDistributionMultipleChoices';
import AnswersDistributionSlider from './answersDistribution/AnswersDistributionSlider';
import AnswersDistributionTextInput from './answersDistribution/AnswersDistributionTextInput';

type Props = {
  maxWidth: number;
  detailedCharts: Chart[];
  chartRefs: MultipleRefs<Element>;
  question: QuestionDataAppSetting;
  responses: AppData[];
};

/**
 * Component that act as a container for all the detailed chart for a given question
 *
 * @param maxWidth The max width of the charts
 * @param detailedCharts The detailed charts to be displayed
 * @param chartRefs The object into which to add the ref of the element containing each chart
 * @param question The question for which to display detailed information
 * @param responses The responses provided by the user to the quiz
 */
const QuestionDetailedCharts = ({
  maxWidth,
  detailedCharts,
  chartRefs,
  question,
  responses,
}: Props) => {
  const { t } = useTranslation();

  const appDataForQuestion = useMemo(
    () => getAllAppDataByQuestionId(responses, question.data.questionId),
    [responses, question]
  );

  const appDataDataForQuestion = useMemo(
    () =>
      getAllAppDataByQuestionId(responses, question.data.questionId).map(
        (s) => s.data
      ),
    [responses, question]
  );

  /**
   * Function to render the correct chart for chart type AnswerDistribution,
   * given the type of the question we are currently rendering
   */
  const renderAnswerDistributionChart = useCallback(
    (chart: Chart) => {
      switch (question.data.type) {
        case QuestionType.MULTIPLE_CHOICES:
          return (
            <AnswersDistributionMultipleChoices
              maxWidth={maxWidth}
              questionData={question.data}
              appDataForQuestion={
                appDataDataForQuestion as MultipleChoiceAppDataData[]
              }
            />
          );
        case QuestionType.SLIDER:
          return (
            <AnswersDistributionSlider
              maxWidth={maxWidth}
              questionData={question.data}
              appDataForQuestion={appDataDataForQuestion as SliderAppDataData[]}
            />
          );
        case QuestionType.TEXT_INPUT:
          return (
            <AnswersDistributionTextInput
              maxWidth={maxWidth}
              questionData={question.data}
              appDataForQuestion={appDataDataForQuestion as TextAppDataData[]}
            />
          );
        case QuestionType.FILL_BLANKS: {
          const fillAppData = appDataForQuestion.map((appData) => ({
            ...appData,
            data: appData.data as FillTheBlanksAppDataData,
          }));

          if (chart.type === QuestionType.FILL_BLANKS) {
            return (
              <AnswersDistributionFillInTheBlanks
                maxWidth={maxWidth}
                questionData={question.data}
                appDataForQuestion={fillAppData}
                chartIndex={chart.chartIndex}
              />
            );
          } else {
            // TODO: better handle chart type.
            return <h1>The chart type is not valid</h1>;
          }
        }
        default:
          return <Typography> {t('Error, question type unknown')} </Typography>;
      }
    },
    [question.data, maxWidth, appDataDataForQuestion, t, appDataForQuestion]
  );

  /**
   * Function to render the correct chart given the chart type
   */
  const renderChartType = useCallback(
    (type: symbol, chart: Chart) => {
      switch (type) {
        case DetailedChartType.ANSWER_FREQUENCY:
          return renderAnswerDistributionChart(chart);
        default:
          return <Typography> {t('Error, chart type unknown')} </Typography>;
      }
    },
    [renderAnswerDistributionChart, t]
  );

  return detailedCharts.map((chart) => {
    return (
      <Box
        ref={(elm: HTMLElement) => {
          if (chartRefs.current) {
            chartRefs.current[chart.label] = elm;
          }
        }}
        key={chart.label}
        id={chart.link}
        data-cy={buildAnalyticsDetailedChartCy(chart.label)}
      >
        {renderChartType(chart.chartType, chart)}
      </Box>
    );
  });
};

export default QuestionDetailedCharts;
