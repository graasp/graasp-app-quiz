import { useMemo } from 'react';

import { useTheme } from '@mui/material';

import { truncateText } from '../../../../utils/plotUtils';
import {
  ChartData,
  MultipleChoiceAppDataData,
  MultipleChoicesAppSettingData,
} from '../../../types/types';
import AnswersDistributionBarChart from './AnswersDistributionBarChart';

type Props = {
  maxWidth: number;
  questionData: MultipleChoicesAppSettingData;
  appDataForQuestion: MultipleChoiceAppDataData[];
};

/**
 * Component used to display the answers distribution for the multiple choices question type
 *
 * @param maxWidth The max width of the chart
 * @param question The question for which to display detailed information into the chart
 * @param appDataForQuestion The app data for the question (i.e. users answers)
 */
const AnswersDistributionMultipleChoices = ({
  maxWidth,
  questionData,
  appDataForQuestion,
}: Props) => {
  const theme = useTheme();
  const correctChoices = useMemo(
    () =>
      questionData.choices
        .filter(({ isCorrect }) => isCorrect)
        .map(({ value }) => value),
    [questionData]
  );

  /**
   * Initialize the object to use in the responses count, so that every possible answer are initially set to 0
   */
  const questions = useMemo(() => {
    const initialCounts: Record<string, number> = Object.fromEntries(
      questionData.choices.map((choice) => [choice.value, 0])
    );

    return initialCounts;
  }, [questionData]);

  const responsesCount = useMemo(
    () =>
      appDataForQuestion.reduce(
        (questionsCountAcc, appData) =>
          appData.choices.reduce((acc, choice) => {
            acc[choice]++;
            return acc;
          }, questionsCountAcc as Record<string, number>),
        questions
      ),
    [appDataForQuestion, questions]
  );

  const totalCount = useMemo(
    () => Object.values(responsesCount).reduce((acc, count) => acc + count, 0),
    [responsesCount]
  );

  const chartData = useMemo(
    () =>
      Object.entries(responsesCount).reduce(
        (acc, [choice, count], idx) => ({
          data: {
            x: [...acc.data.x, `A${idx + 1}<br>${truncateText(choice, 10)}`],
            y: [...acc.data.y, count],
          },
          percentage: [...acc.percentage, count / totalCount],
          maxValue: Math.max(acc.maxValue, count),
          hoverText: [...acc.hoverText, choice],
          barColors: [
            ...acc.barColors,
            correctChoices.includes(choice)
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
    [responsesCount, totalCount, correctChoices, theme]
  );

  return (
    <AnswersDistributionBarChart
      maxWidth={maxWidth}
      questionName={questionData.question}
      chartData={chartData}
    />
  );
};

export default AnswersDistributionMultipleChoices;
