import groupBy from 'lodash.groupby';

import { useMemo } from 'react';

import { useTheme } from '@mui/material';

import { truncateText } from '../../../../utils/plotUtils';
import { computeCorrectness } from '../../../context/utilities';
import { ChartData, TextAppDataData, TextAppSettingData } from '../../../types/types';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

type Props = {
  maxWidth: number;
  questionData: TextAppSettingData;
  appDataForQuestion: TextAppDataData[];
};

/**
 * Component used to display the answers distribution for the text input question type
 *
 * @param maxWidth The max width of the chart
 * @param questionData The question for which to display detailed information into the chart
 * @param appDataForQuestion The app data for the question (i.e. users answers)
 */
const AnswersDistributionTextInput = ({
  maxWidth,
  questionData,
  appDataForQuestion,
}: Props) => {
  const theme = useTheme();
  const responsesByText = useMemo(
    () => groupBy(appDataForQuestion, (r) => r.text),
    [appDataForQuestion]
  );

  const chartData = useMemo(
    () =>
      Object.entries(responsesByText).reduce(
        (acc, [text, list], idx) => {
          return {
            data: {
              x: [...acc.data.x, `A${idx + 1}<br>${truncateText(text, 10)}`],
              y: [...acc.data.y, list.length],
            },
            percentage: [
              ...acc.percentage,
              list.length / appDataForQuestion.length,
            ],
            maxValue: Math.max(acc.maxValue, list.length),
            hoverText: [...acc.hoverText, text],
            barColors: [
              ...acc.barColors,
              computeCorrectness(questionData, list.at(0))
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
        } as ChartData
      ),
    [responsesByText, appDataForQuestion, questionData, theme]
  );

  return (
    <AnswersDistributionBarChart
      maxWidth={maxWidth}
      questionName={questionData.question}
      chartData={chartData}
    />
  );
};

export default AnswersDistributionTextInput;
