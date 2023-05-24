import { useCallback, useEffect, useState } from 'react';

import { truncateText } from '../../../../utils/plotUtils';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

const AnswersDistributionTextInput = ({
  maxWidth,
  question,
  appDataForQuestion,
}) => {
  const getResponsesByText = useCallback(() => {
    return appDataForQuestion.groupBy((r) => r.data.text);
  }, [appDataForQuestion]);

  const [responsesByText, setResponsesByText] = useState(getResponsesByText());

  useEffect(
    () => setResponsesByText(getResponsesByText()),
    [getResponsesByText]
  );

  const chartData = Array.from(responsesByText).reduce(
    (acc, [text, list], idx) => {
      return {
        data: {
          x: [...acc.data.x, `A${idx + 1}<br>${truncateText(text, 10)}`],
          y: [...acc.data.y, list.size],
        },
        percentage: [...acc.percentage, list.size / appDataForQuestion.size],
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
  );

  return (
    <AnswersDistributionBarChart
      maxWidth={maxWidth}
      question={question}
      chartData={chartData}
    />
  );
};

export default AnswersDistributionTextInput;
