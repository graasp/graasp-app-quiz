import { useCallback, useEffect, useState } from 'react';

import { truncateText } from '../../../../utils/plotUtils';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

const AnswersDistributionMultipleChoices = ({
  maxWidth,
  question,
  appDataForQuestion,
}) => {
  const getResponsesByChoices = useCallback(() => {
    return appDataForQuestion
      .map((r) => {
        return {
          ...r,
          data: {
            ...r.data,
            choices: r.data.choices.join(', '),
          },
        };
      })
      .groupBy((r) => r.data.choices);
  }, [appDataForQuestion]);

  const [responsesByChoices, setResponsesByChoices] = useState(
    getResponsesByChoices()
  );

  useEffect(
    () => setResponsesByChoices(getResponsesByChoices()),
    [getResponsesByChoices]
  );

  const chartData = Array.from(responsesByChoices).reduce(
    (acc, [choices, list], idx) => {
      return {
        data: {
          x: [...acc.data.x, `A${idx + 1}<br>${truncateText(choices, 10)}`],
          y: [...acc.data.y, list.size],
        },
        percentage: [...acc.percentage, list.size / appDataForQuestion.size],
        maxValue: Math.max(acc.maxValue, list.size),
        hoverText: [...acc.hoverText, choices],
      };
    },
    {
      data: { x: [], y: [] },
      percentage: [],
      maxValue: 0,
      hoverText: [],
    }
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
