import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material';

import { splitSentence } from '../../../../utils/fillInTheBlanks';
import { truncateText } from '../../../../utils/plotUtils';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

/**
 * Component used to display the answers distribution for the fill in the blank question type
 *
 * @param maxWidth The max width of the chart
 * @param question The question for which to display detailed information into the chart
 * @param appDataForQuestion The app data for the question (i.e. users answers)
 * @param chartIndex The index of the chart, the index represents which blank in the question the current chart is displaying
 */
const AnswersDistributionFillInTheBlanks = ({
  maxWidth,
  question,
  appDataForQuestion,
  chartIndex,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const responsesByFilledWords = useMemo(() => {
    return appDataForQuestion
      .map((appData) => {
        const { answers } = splitSentence(
          appData.data.text,
          question.data.text
        );
        return {
          ...appData,
          data: {
            ...appData.data,
            filledWord: answers[chartIndex],
          },
        };
      })
      .groupBy((r) => r.data.filledWord.text);
  }, [appDataForQuestion, question, chartIndex]);

  const chartData = useMemo(
    () =>
      Array.from(responsesByFilledWords).reduce(
        (acc, [filledWord, list], idx) => {
          const placedWords = list.get(0).data.filledWord.placed;
          return {
            data: {
              x: [
                ...acc.data.x,
                `A${idx + 1}<br>${truncateText(filledWord, 10)}`,
              ],
              y: [...acc.data.y, list.size],
            },
            percentage: [
              ...acc.percentage,
              list.size / appDataForQuestion.size,
            ],
            maxValue: Math.max(acc.maxValue, list.size),
            hoverText: [...acc.hoverText, question.data.text],
            barColors: [
              ...acc.barColors,
              placedWords && placedWords?.displayed === placedWords?.text
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
    [responsesByFilledWords, appDataForQuestion, theme, question]
  );

  return (
    <AnswersDistributionBarChart
      maxWidth={maxWidth}
      questionName={`${question.data.question} - ${t('blank')} ${
        chartIndex + 1
      }`}
      chartData={chartData}
    />
  );
};

export default AnswersDistributionFillInTheBlanks;
