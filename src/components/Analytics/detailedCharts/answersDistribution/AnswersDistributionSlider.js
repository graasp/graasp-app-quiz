import { useMemo } from 'react';

import { useTheme } from '@mui/material';

import { computeCorrectness } from '../../../context/utilities';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

/**
 * Component used to display the answers distribution for the slider question type
 *
 * @param maxWidth The max width of the chart
 * @param question The question for which to display detailed information into the chart
 * @param appDataForQuestion The app data for the question (i.e. users answers)
 */
const AnswersDistributionSlider = ({
  maxWidth,
  question,
  appDataForQuestion,
}) => {
  const theme = useTheme();
  const responsesByValue = useMemo(() => {
    return appDataForQuestion.groupBy((r) => r.data.value);
  }, [appDataForQuestion]);

  const chartData = useMemo(
    () =>
      Array.from(responsesByValue)
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
          (acc, [value, list]) => {
            return {
              data: {
                x: [...acc.data.x, value],
                y: [...acc.data.y, list.size],
              },
              percentage: [
                ...acc.percentage,
                list.size / appDataForQuestion.size,
              ],
              maxValue: Math.max(acc.maxValue, list.size),
              hoverText: [...acc.hoverText, value],
              barColors: [
                ...acc.barColors,
                computeCorrectness(question.data, list.get(0).data)
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
    [responsesByValue, appDataForQuestion, theme, question]
  );

  return (
    <AnswersDistributionBarChart
      maxWidth={maxWidth}
      questionName={question.data.question}
      chartData={chartData}
    />
  );
};

export default AnswersDistributionSlider;
