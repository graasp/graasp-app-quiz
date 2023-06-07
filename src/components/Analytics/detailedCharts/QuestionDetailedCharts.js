import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { QUESTION_TYPES } from '../../../config/constants';
import { buildAnalyticsDetailedChartCy } from '../../../config/selectors';
import { getAllAppDataByQuestionId } from '../../context/utilities';
import { DetailedChartType } from '../AnalyticsCharts';
import AnswersDistributionFillInTheBlanks from './answersDistribution/AnswersDistributionFillInTheBlanks';
import AnswersDistributionMultipleChoices from './answersDistribution/AnswersDistributionMultipleChoices';
import AnswersDistributionSlider from './answersDistribution/AnswersDistributionSlider';
import AnswersDistributionTextInput from './answersDistribution/AnswersDistributionTextInput';

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
}) => {
  const { t } = useTranslation();

  const appDataForQuestion = useMemo(
    () => getAllAppDataByQuestionId(responses, question.id),
    [responses, question]
  );

  /**
   * Function to render the correct chart for chart type AnswerDistribution,
   * given the type of the question we are currently rendering
   */
  const renderAnswerDistributionChart = useCallback(
    (chartIndex) => {
      switch (question.data.type) {
        case QUESTION_TYPES.MULTIPLE_CHOICES:
          return (
            <AnswersDistributionMultipleChoices
              maxWidth={maxWidth}
              question={question}
              appDataForQuestion={appDataForQuestion}
            />
          );
        case QUESTION_TYPES.SLIDER:
          return (
            <AnswersDistributionSlider
              maxWidth={maxWidth}
              question={question}
              appDataForQuestion={appDataForQuestion}
            />
          );
        case QUESTION_TYPES.TEXT_INPUT:
          return (
            <AnswersDistributionTextInput
              maxWidth={maxWidth}
              question={question}
              appDataForQuestion={appDataForQuestion}
            />
          );
        case QUESTION_TYPES.FILL_BLANKS:
          return (
            <AnswersDistributionFillInTheBlanks
              maxWidth={maxWidth}
              question={question}
              appDataForQuestion={appDataForQuestion}
              chartIndex={chartIndex}
            />
          );
        default:
          return <Typography> {t('Error, question type unknown')} </Typography>;
      }
    },
    [maxWidth, question, appDataForQuestion, t]
  );

  /**
   * Function to render the correct chart given the chart type
   */
  const renderChartType = useCallback(
    (type, chartIndex) => {
      switch (type) {
        case DetailedChartType.ANSWER_FREQUENCY:
          return renderAnswerDistributionChart(chartIndex);
        default:
          return <Typography> {t('Error, chart type unknown')} </Typography>;
      }
    },
    [renderAnswerDistributionChart, t]
  );

  return detailedCharts.map((chart) => {
    return (
      <Box
        ref={(elm) => (chartRefs.current[chart.label] = elm)}
        key={chart.label}
        id={chart.link}
        data-cy={buildAnalyticsDetailedChartCy(chart.label)}
      >
        {renderChartType(chart.chartType, chart.chartIndex)}
      </Box>
    );
  });
};

export default QuestionDetailedCharts;
