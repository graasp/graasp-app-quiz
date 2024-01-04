import groupBy from 'lodash.groupby';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from '@mui/material';

import { splitSentence } from '../../../../utils/fillInTheBlanks';
import { truncateText } from '../../../../utils/plotUtils';
import {
  ChartData,
  FillTheBlanksAppDataData,
  FillTheBlanksAppSettingData,
} from '../../../types/types';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

type Props = {
  maxWidth: number;
  questionData: FillTheBlanksAppSettingData;
  appDataForQuestion: FillTheBlanksAppDataData[];
  chartIndex: number;
};

/**
 * Component used to display the answers distribution for the fill in the blank question type
 *
 * @param maxWidth The max width of the chart
 * @param questionData The question for which to display detailed information into the chart
 * @param appDataForQuestion The app data for the question (i.e. users answers)
 * @param chartIndex The index of the chart, the index represents which blank in the question the current chart is displaying
 */
const AnswersDistributionFillInTheBlanks = ({
  maxWidth,
  questionData,
  appDataForQuestion,
  chartIndex,
}: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const responsesByFilledWords = useMemo(() => {
    const responsesWithFilledWord = appDataForQuestion.map((appData) => {
      const { answers } = splitSentence(appData.text, questionData.text);
      return {
        ...appData,
        filledWord: answers[chartIndex],
      };
    });
    return groupBy(responsesWithFilledWord, (r) => r.filledWord.text);
  }, [appDataForQuestion, questionData, chartIndex]);

  const chartData = useMemo(
    () =>
      Object.entries(responsesByFilledWords).reduce<ChartData>(
        (acc, [filledWord, list], idx) => {
          const placedWords = list[0].filledWord;
          return {
            data: {
              x: [
                ...acc.data.x,
                `A${idx + 1}<br>${truncateText(filledWord, 10)}`,
              ],
              y: [...acc.data.y, list.length],
            },
            percentage: [
              ...acc.percentage,
              list.length / appDataForQuestion.length,
            ],
            maxValue: Math.max(acc.maxValue, list.length),
            hoverText: [...acc.hoverText, questionData.text],
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
    [responsesByFilledWords, appDataForQuestion, theme, questionData]
  );

  return (
    <AnswersDistributionBarChart
      maxWidth={maxWidth}
      questionName={`${questionData.question} - ${t('blank')} ${
        chartIndex + 1
      }`}
      chartData={chartData}
    />
  );
};

export default AnswersDistributionFillInTheBlanks;
