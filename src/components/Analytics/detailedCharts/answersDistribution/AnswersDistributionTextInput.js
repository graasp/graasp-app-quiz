import { useMemo } from 'react';

import { truncateText } from '../../../../utils/plotUtils';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

/**
 * Component used to display the answers distribution for the text input question type
 *
 * @param maxWidth The max width of the chart
 * @param question The question for which to display detailed information into the chart
 * @param appDataForQuestion The app data for the question (i.e. users answers)
 */
const AnswersDistributionTextInput = ({
  maxWidth,
  question,
  appDataForQuestion,
}) => {
  const responsesByText = useMemo(
    () => appDataForQuestion.groupBy((r) => r.data.text),
    [appDataForQuestion]
  );

  const chartData = useMemo(
    () =>
      Array.from(responsesByText).reduce(
        (acc, [text, list], idx) => {
          return {
            data: {
              x: [...acc.data.x, `A${idx + 1}<br>${truncateText(text, 10)}`],
              y: [...acc.data.y, list.size],
            },
            percentage: [
              ...acc.percentage,
              list.size / appDataForQuestion.size,
            ],
            maxValue: Math.max(acc.maxValue, list.size),
            hoverText: [...acc.hoverText, text],
          };
        },
        {
          data: { x: [], y: [] },
          percentage: [],
          maxValue: 0,
          hoverText: [],
        }
      ),
    [responsesByText, appDataForQuestion]
  );

  return (
    <AnswersDistributionBarChart
      maxWidth={maxWidth}
      questionName={question.data.question}
      chartData={chartData}
    />
  );
};

export default AnswersDistributionTextInput;
