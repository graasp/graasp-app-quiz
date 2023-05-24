import { useCallback, useEffect, useState } from 'react';

import { splitSentence } from '../../../../utils/fillInTheBlanks';
import { truncateText } from '../../../../utils/plotUtils';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

const AnswersDistributionFillInTheBlanks = ({
  maxWidth,
  question,
  appDataForQuestion,
}) => {
  const getResponsesByFilledWords = useCallback(() => {
    return appDataForQuestion
      .map((r) => {
        const { answers } = splitSentence(r.data.text, question.data.text);
        return {
          ...r,
          data: {
            ...r.data,
            filledWords: answers.map((a) => a.text).join(', '),
          },
        };
      })
      .groupBy((r) => r.data.filledWords);
  }, [appDataForQuestion, question]);

  const [responsesByFilledWords, setResponsesByFilledWords] = useState(
    getResponsesByFilledWords()
  );

  useEffect(
    () => setResponsesByFilledWords(getResponsesByFilledWords()),
    [getResponsesByFilledWords]
  );

  const chartData = Array.from(responsesByFilledWords).reduce(
    (acc, [filledWords, list], idx) => {
      return {
        data: {
          x: [...acc.data.x, `A${idx + 1}<br>${truncateText(filledWords, 10)}`],
          y: [...acc.data.y, list.size],
        },
        percentage: [...acc.percentage, list.size / appDataForQuestion.size],
        maxValue: Math.max(acc.maxValue, list.size),
        hoverText: [...acc.hoverText, list.first().data.text],
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

export default AnswersDistributionFillInTheBlanks;
