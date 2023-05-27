import { useMemo } from 'react';

import { truncateText } from '../../../../utils/plotUtils';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

const AnswersDistributionMultipleChoices = ({
  maxWidth,
  question,
  appDataForQuestion,
}) => {
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
          };
        },
        {
          data: { x: [], y: [] },
          percentage: [],
          maxValue: 0,
          hoverText: [],
        }
      ),
    [responsesCount, totalCount]
  );

  return (
    <AnswersDistributionBarChart
      maxWidth={maxWidth}
      question={question}
      chartData={chartData}
    />
  );
};

export default AnswersDistributionMultipleChoices;
