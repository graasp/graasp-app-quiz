import { useCallback, useEffect, useState } from 'react';

import AnswersDistributionBarChart from './AnswersDistributionBarChart';

const AnswersDistributionSlider = ({
  maxWidth,
  question,
  appDataForQuestion,
}) => {
  const getResponsesByValue = useCallback(() => {
    return appDataForQuestion.groupBy((r) => r.data.value);
  }, [appDataForQuestion]);

  const [responsesByValue, setResponsesByValue] = useState(
    getResponsesByValue()
  );

  useEffect(
    () => setResponsesByValue(getResponsesByValue()),
    [getResponsesByValue]
  );

  const chartData = Array.from(responsesByValue)
    .sort(([val1], [val2]) => {
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    })
    .reduce(
      (acc, [value, list], idx) => {
        return {
          data: {
            x: [...acc.data.x, value],
            y: [...acc.data.y, list.size],
          },
          percentage: [...acc.percentage, list.size / appDataForQuestion.size],
          maxValue: Math.max(acc.maxValue, list.size),
          hoverText: [...acc.hoverText, list.size],
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

export default AnswersDistributionSlider;
