import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { GeneralChartType } from '../AnalyticsCharts';
import CorrectResponsePerUser from './CorrectResponsePerUser';
import CorrectResponsesPercentage from './CorrectResponsesPercentage';
import QuestionDifficulty from './QuestionDifficulty';

/**
 * Component that acts as a container for all the general charts.
 *
 * Will display all the general charts, and return the elements ref corresponding to those charts,
 * to be used by the AutoScrollableMenu component
 *
 * @param maxWidth The max width that the charts can have
 * @param generalCharts The general charts to be displayed
 * @param chartRefs The object into which to add the ref of the element containing each chart
 * @param goToDetailedQuestion The callback function to call in order to redirect the user to the corresponding
 * detailed chart when clicking on a particular question
 * @param questions The quiz questions
 * @param order The order in which the questions appear in the quiz
 * @param responses The responses provided by the user to the quiz
 * @param members The members that responded to the quiz
 */
const GeneralCharts = ({
  maxWidth,
  generalCharts,
  chartRefs,
  goToDetailedQuestion,
  questions,
  order,
  responses,
  members,
}) => {
  const { t } = useTranslation();

  /**
   * Function to call to render the correct chart given its type
   */
  const renderChartType = useCallback(
    (type) => {
      switch (type) {
        case GeneralChartType.QUIZ_PERFORMANCE:
          return (
            <QuestionDifficulty
              maxWidth={maxWidth}
              goToDetailedQuestion={goToDetailedQuestion}
              responses={responses}
              order={order}
              questions={questions}
            />
          );
        case GeneralChartType.USER_PERFORMANCE:
          return (
            <CorrectResponsePerUser
              maxWidth={maxWidth}
              responses={responses}
              questions={questions}
              members={members}
            />
          );
        case GeneralChartType.QUIZ_CORRECT_PERCENTAGE:
          return (
            <CorrectResponsesPercentage
              maxWidth={maxWidth}
              goToDetailedQuestion={goToDetailedQuestion}
              responses={responses}
              order={order}
              questions={questions}
            />
          );
        default:
          return <Typography> {t('Error, chart type unknown')} </Typography>;
      }
    },
    [maxWidth, goToDetailedQuestion, t, members, order, responses, questions]
  );

  return generalCharts.map((menuLabel) => {
    return (
      <Box
        ref={(elm) => (chartRefs.current[menuLabel.label] = elm)}
        key={menuLabel.label}
        id={menuLabel.link}
      >
        {renderChartType(menuLabel.chartType)}
      </Box>
    );
  });
};

export default GeneralCharts;
