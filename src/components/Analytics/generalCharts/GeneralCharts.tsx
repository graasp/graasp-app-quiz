import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

import { AppData, Member } from '@graasp/sdk';

import { Chart, MultipleRefs, QuestionDataAppSetting } from '../../types/types';
import { GeneralChartType } from '../analyticsChartsUtils';
import CorrectResponsePerUser from './CorrectResponsePerUser';
import CorrectResponsesPercentage from './CorrectResponsesPercentage';
import QuestionDifficulty from './QuestionDifficulty';

type Props = {
  maxWidth: number;
  generalCharts: Chart[];
  chartRefs: MultipleRefs<Element>;
  goToDetailedQuestion: (qId: string) => void;
  questions: QuestionDataAppSetting[];
  order: string[];
  responses: AppData[];
  members: Member[];
  considerLastAttemptsOnly: boolean;
};

type GeneralChartTypeKeys = keyof typeof GeneralChartType;
type GeneralChartTypeValues = (typeof GeneralChartType)[GeneralChartTypeKeys];

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
 * @param considerLastAttemptsOnly If true, the analytics are computed with the lastest users' answers
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
  considerLastAttemptsOnly,
}: Props) => {
  const { t } = useTranslation();

  /**
   * Function to call to render the correct chart given its type
   */
  const renderChartType = useCallback(
    (type: GeneralChartTypeValues) => {
      switch (type) {
        case GeneralChartType.QUIZ_PERFORMANCE:
          return (
            <QuestionDifficulty
              maxWidth={maxWidth}
              goToDetailedQuestion={goToDetailedQuestion}
              responses={responses}
              order={order}
              questions={questions}
              considerLastAttemptsOnly={considerLastAttemptsOnly}
            />
          );
        case GeneralChartType.USER_PERFORMANCE:
          return (
            <CorrectResponsePerUser
              maxWidth={maxWidth}
              responses={responses}
              questions={questions}
              members={members}
              considerLastAttemptsOnly={considerLastAttemptsOnly}
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
              considerLastAttemptsOnly={considerLastAttemptsOnly}
            />
          );
        default:
          return <Typography> {t('Error, chart type unknown')} </Typography>;
      }
    },
    [maxWidth, goToDetailedQuestion, responses, order, questions, considerLastAttemptsOnly, members, t]
  );

  return generalCharts.map((chart) => {
    return (
      <Box
        ref={(elm: HTMLElement) => (chartRefs.current[chart.label] = elm)}
        key={chart.label}
        id={chart.link}
      >
        {renderChartType(chart.chartType)}
      </Box>
    );
  });
};

export default GeneralCharts;
