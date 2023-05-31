import { useMemo } from 'react';

import { useTheme } from '@mui/material';

import { truncateText } from '../../../../utils/plotUtils';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

/**
 * Component used to display the answers distribution for the multiple choices question type
 *
 * @param maxWidth The max width of the chart
 * @param question The question for which to display detailed information into the chart
 * @param appDataForQuestion The app data for the question (i.e. users answers)
 */
const AnswersDistributionMultipleChoices = ({
  maxWidth,
  question,
  appDataForQuestion,
}) => {
  const theme = useTheme();
  const correctChoices = useMemo(
    () =>
      question.data.choices
        .filter(({ isCorrect }) => isCorrect)
        .map(({ value }) => value),
    [question]
  );

  const questions = useMemo(
    () =>
      question.data.choices.reduce((acc, c) => {
        acc[c.value] = 0;
        return acc;
      }, {}),
    [question]
  );

  const responsesCount = useMemo(
    () =>
      appDataForQuestion.reduce(
        (questionsCountAcc, appData) =>
          appData.data.choices.reduce((acc, choice) => {
            acc[choice]++;
            return acc;
          }, questionsCountAcc),
        questions
      ),
    [appDataForQuestion, questions]
  );

  const totalCount = useMemo(
    () => Object.values(responsesCount).reduce((acc, count) => acc + count, 0),
    [responsesCount]
  );

  const chartData = useMemo(
    () =>
      Object.entries(responsesCount).reduce(
        (acc, [choice, count], idx) => {
          return {
            data: {
              x: [...acc.data.x, `A${idx + 1}<br>${truncateText(choice, 10)}`],
              y: [...acc.data.y, count],
            },
            percentage: [...acc.percentage, count / totalCount],
            maxValue: Math.max(acc.maxValue, count),
            hoverText: [...acc.hoverText, choice],
            barColors: [
              ...acc.barColors,
              correctChoices.includes(choice)
                ? theme.palette.success.main
                : theme.palette.primary.main,
            ],
          };
        },
        {
          data: { x: [], y: [] },
          percentage: [],
          maxValue: 0,
          hoverText: [],
          barColors: [],
        }
      ),
    [responsesCount, totalCount, correctChoices, theme]
  );

  return (
    <AnswersDistributionBarChart
      maxWidth={maxWidth}
      questionName={question.data.question}
      chartData={chartData}
    />
  );
};

export default AnswersDistributionMultipleChoices;
