import groupBy from 'lodash.groupby';
import Plotly from 'plotly.js-basic-dist-min';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import createPlotlyComponent from 'react-plotly.js/factory';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';

import { AppData } from '@graasp/sdk';

import { ANALYTICS_GENERAL_CORRECT_RESPONSE_PERCENTAGE_CY } from '../../../config/selectors';
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
  goToDetailedQuestion: (qId: string) => void;
  responses: AppData[];
  order: string[];
  questions: QuestionDataAppSetting[];
};

type ChartData = {
  data: { x: string[]; y: number[] };
  hoverText: string[];
  qIds: string[];
};

/**
 * Component that renders the percentage of correct responses in the quiz
 *
 * @param maxWidth the maximum width of the chart
 * @param goToDetailedQuestion The callback to call to be redirected to the detailed chart corresponding to
 * the question that has been clicked on
 * @param responses The responses provided by the user to the quiz
 * @param order The order in which the questions appear in the quiz
 * @param questions The question for which to display detailed information
 */
const CorrectResponsesPercentage = ({
  maxWidth,
  goToDetailedQuestion,
  responses,
  order,
  questions,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const responsesByQId = useMemo(
    () => groupBy(responses, (r) => r.data.questionId),
    [responses]
  );

  const chartData = useMemo(() => {
    return order.reduce(
      (acc, qId, idx) => {
        const question = getQuestionById(questions, qId);

        // Ignore undefined questions
        if (!question) {
          return acc;
        }

        const responses = responsesByQId[qId];
        const nbCorrect = responses.reduce(
          (acc, next) =>
            question &&
            computeCorrectness(question.data, next.data as QuestionAppDataData) // TODO: avoid cast
              ? acc + 1
              : acc,
          0
        );

        return {
          data: {
            x: [...acc.data.x, `Q${idx + 1}`],
            y: [...acc.data.y, nbCorrect / responses.length],
          },
          hoverText: [...acc.hoverText, question.data.question],
          qIds: [...acc.qIds, question.data.questionId],
        };
      },
      {
        data: { x: [], y: [] },
        hoverText: [],
        qIds: [],
      } as ChartData
    );
  }, [questions, responsesByQId, order]);

  return (
    <Box
      sx={{ width: '100%' }}
      data-cy={ANALYTICS_GENERAL_CORRECT_RESPONSE_PERCENTAGE_CY}
    >
      <Plot
        data={[
          {
            name: t('Quiz correct response percentage'),
            type: 'scatter',
            ...chartData.data,
            marker: {
              color: theme.palette.primary.main,
            },
            ...hoverData({
              hoverText: chartData.hoverText,
              meta: chartData.qIds,
              hoverTemplate: `%{hovertext}<br><br> - ${t(
                'Percentage correct responses'
              )}: %{y:.1%} <extra></extra>`,
              borderColor: theme.palette.primary.main,
            }),
            fill: 'tozeroy',
          },
        ]}
        layout={{
          ...defaultLayout({
            title: t('Quiz correct response percentage'),
            width: maxWidth,
            percentage: true,
            maxValueY: 1.1,
          }),
          xaxis: {
            range: [-0.2, order.length - 0.8], // Make range a bit bigger at beginning and end, to fully display dot
          },
        }}
        config={defaultSettings('Quiz_correct_response_percentage')}
        onClick={({ points }: ChartEvent<string>) => {
          const { meta } = points[0];
          if (meta) {
            goToDetailedQuestion(meta);
          }
        }}
      />
    </Box>
  );
};

export default CorrectResponsesPercentage;
