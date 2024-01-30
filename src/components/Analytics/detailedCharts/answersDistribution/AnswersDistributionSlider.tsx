import groupBy from 'lodash.groupby';

import { useMemo } from 'react';

import { useTheme } from '@mui/material';

import { computeCorrectness } from '../../../context/utilities';
import {
  ChartData,
  SliderAppDataData,
  SliderAppSettingData,
} from '../../../types/types';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

type Props = {
  maxWidth: number;
  questionData: SliderAppSettingData;
  appDataForQuestion: SliderAppDataData[];
};

/**
 * Component used to display the answers distribution for the slider question type
 *
 * @param maxWidth The max width of the chart
 * @param questionData The question for which to display detailed information into the chart
 * @param appDataForQuestion The app data for the question (i.e. users answers)
 */
const AnswersDistributionSlider = ({
  maxWidth,
  questionData,
  appDataForQuestion,
}: Props) => {
  const theme = useTheme();
  const responsesByValue = useMemo(
    () => groupBy(appDataForQuestion, (r) => r.value),
    [appDataForQuestion]
  );

  const chartData = useMemo(
    () =>
      Object.entries(responsesByValue)
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
          (acc, [value, list]) => ({
            data: {
              x: [...acc.data.x, value],
              y: [...acc.data.y, list.length],
            },
            percentage: [
              ...acc.percentage,
              list.length / appDataForQuestion.length,
            ],
            maxValue: Math.max(acc.maxValue, list.length),
            hoverText: [...acc.hoverText, value],
            barColors: [
              ...acc.barColors,
              computeCorrectness(questionData, list.at(0))
                ? theme.palette.success.main
                : theme.palette.primary.main,
            ],
          }),
          {
            data: { x: [], y: [] },
            percentage: [],
            maxValue: 0,
            hoverText: [],
            barColors: [],
          } as ChartData
        ),
    [responsesByValue, appDataForQuestion, theme, questionData]
  );

  return (
    <AnswersDistributionBarChart
      maxWidth={maxWidth}
      questionName={questionData.question}
      chartData={chartData}
    />
  );
};

export default AnswersDistributionSlider;
