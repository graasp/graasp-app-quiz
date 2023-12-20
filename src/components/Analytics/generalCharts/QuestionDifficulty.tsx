import groupBy from 'lodash.groupby';
import Plotly from 'plotly.js-basic-dist-min';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import createPlotlyComponent from 'react-plotly.js/factory';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';

import { AppData } from '@graasp/sdk';

import { CHART_SECONDARY_COLOR } from '../../../config/constants';
import { ANALYTICS_GENERAL_QUIZ_PERFORMANCE_CY } from '../../../config/selectors';
import {
  defaultLayout,
  defaultSettings,
  hoverData,
} from '../../../utils/plotUtils';
import { computeCorrectness, getQuestionById } from '../../context/utilities';
import {
  ChartEvent,
  QuestionAppDataData,
  QuestionDataAppSetting,
} from '../../types/types';

const Plot = createPlotlyComponent(Plotly);

type Props = {
  maxWidth: number;
  responses: AppData[];
  order: string[];
  questions: QuestionDataAppSetting[];
  goToDetailedQuestion: (qId: string) => void;
};

type PercentageMetaType = [number, string];

type Chart = {
  dataCorrect: { x: string[]; y: number[] };
  dataIncorrect: { x: string[]; y: number[] };
  percentageCorrect: PercentageMetaType[];
  percentageIncorrect: PercentageMetaType[];
  maxValue: number;
  hoverText: string[];
};

/**
 * Component that renders the question difficulty chart
 *
 * @param maxWidth The maximum width of the chart
 * @param goToDetailedQuestion The callback to call to be redirected to the detailed chart corresponding to
 * the question that has been clicked on
 * @param responses The responses provided by the user to the quiz
 * @param order The order in which the questions appear in the quiz
 * @param questions The question for which to display detailed information
 */
const QuestionDifficulty = ({
  maxWidth,
  goToDetailedQuestion,
  responses,
  order,
  questions,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  /**
   * Function to calculate the data to be displayed in the chart
   *
   * Returns an object that contains the data, and some additional information used to be displayed on the chart
   *
   * the order of the question are the same as defined when creating the quiz
   */
  const chartData = useMemo(() => {
    const responsesByQId = groupBy(responses, (r) => r.data.questionId);
    return order.reduce(
      (acc, qId, idx) => {
        const question = getQuestionById(questions, qId);

        if (!question) {
          return acc;
        }

        const responses = responsesByQId[qId];
        const nbCorrectAndIncorrect = responses.reduce(
          ([correct, incorrect], next) =>
            question &&
            computeCorrectness(question.data, next.data as QuestionAppDataData)
              ? [correct + 1, incorrect]
              : [correct, incorrect + 1],
          [0, 0]
        );

        return {
          dataCorrect: {
            x: [...acc.dataCorrect.x, `Q${idx + 1}`],
            y: [...acc.dataCorrect.y, nbCorrectAndIncorrect[0]],
          },
          dataIncorrect: {
            x: [...acc.dataIncorrect.x, `Q${idx + 1}`],
            y: [...acc.dataIncorrect.y, nbCorrectAndIncorrect[1]],
          },
          percentageCorrect: [
            ...acc.percentageCorrect,
            [
              nbCorrectAndIncorrect[0] / responses.length,
              question.data.questionId,
            ] as PercentageMetaType,
          ],
          percentageIncorrect: [
            ...acc.percentageIncorrect,
            [
              nbCorrectAndIncorrect[1] / responses.length,
              question.data.questionId,
            ] as PercentageMetaType,
          ],
          maxValue: Math.max(acc.maxValue, responses.length),
          hoverText: [...acc.hoverText, question.data.question],
        };
      },
      {
        dataCorrect: { x: [], y: [] },
        dataIncorrect: { x: [], y: [] },
        percentageCorrect: [],
        percentageIncorrect: [],
        maxValue: 0,
        hoverText: [],
      } as Chart
    );
  }, [questions, responses, order]);

  return (
    <Box sx={{ width: '100%' }} data-cy={ANALYTICS_GENERAL_QUIZ_PERFORMANCE_CY}>
      <Plot
        data={[
          {
            name: t('Correct responses'),
            type: 'bar',
            ...chartData.dataCorrect,
            marker: {
              color: theme.palette.primary.main,
            },
            ...hoverData({
              hoverText: chartData.hoverText,
              meta: chartData.percentageCorrect,
              hoverTemplate: `%{hovertext}<br><br> - ${t(
                'Number of correct responses'
              )}: %{y} <br> - ${t(
                'Percentage correct responses'
              )}: %{meta[0]:.1%} <extra></extra>`,
              borderColor: theme.palette.primary.main,
            }),
            texttemplate: '%{y}',
          },
          {
            name: t('Incorrect responses'),
            type: 'bar',
            ...chartData.dataIncorrect,
            marker: {
              color: CHART_SECONDARY_COLOR,
            },
            ...hoverData({
              hoverText: chartData.hoverText,
              meta: chartData.percentageIncorrect,
              hoverTemplate: `%{hovertext}<br><br> - ${t(
                'Number of incorrect responses'
              )}: %{y} <br> - ${t(
                'Percentage incorrect responses'
              )}: %{meta[0]:.1%} <extra></extra>`,
              borderColor: CHART_SECONDARY_COLOR,
            }),
            texttemplate: '%{y}',
          },
        ]}
        layout={{
          ...defaultLayout({
            title: t('Number of correct/incorrect responses per question'),
            width: maxWidth,
            percentage: false,
            maxValueY: chartData.maxValue,
          }),
          barmode: 'stack',
        }}
        config={defaultSettings('Nb_correct_responses')}
        onClick={({ points }: ChartEvent<[number, string]>) => {
          const { meta } = points[0];
          if (meta && meta[1]) {
            goToDetailedQuestion(meta[1]);
          }
        }}
      />
    </Box>
  );
};

export default QuestionDifficulty;
