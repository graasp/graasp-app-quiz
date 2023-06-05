import Plotly from 'plotly.js-basic-dist-min';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import createPlotlyComponent from 'react-plotly.js/factory';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';

import { ANALYTICS_GENERAL_CORRECT_RESPONSE_PERCENTAGE_CY } from '../../../config/selectors';
import {
  defaultLayout,
  defaultSettings,
  hoverData,
} from '../../../utils/plotUtils';
import { computeCorrectness, getDataWithId } from '../../context/utilities';

const Plot = createPlotlyComponent(Plotly);

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
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const responsesByQId = useMemo(
    () => responses.groupBy((r) => r.data.questionId),
    [responses]
  );

  const chartData = useMemo(() => {
    return order.reduce(
      (acc, qId, idx) => {
        const question = getDataWithId(questions, qId);
        const responses = responsesByQId.get(qId);
        const nbCorrect = responses.reduce(
          (acc, next) =>
            computeCorrectness(next.data, question.data) ? acc + 1 : acc,
          0
        );

        return {
          data: {
            x: [...acc.data.x, `Q${idx + 1}`],
            y: [...acc.data.y, nbCorrect / responses.size],
          },
          hoverText: [...acc.hoverText, question.data.question],
          qIds: [...acc.qIds, question.id],
        };
      },
      {
        data: { x: [], y: [] },
        hoverText: [],
        qIds: [],
      }
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
        onClick={({ points }) => goToDetailedQuestion(points[0].meta)}
      />
    </Box>
  );
};

export default CorrectResponsesPercentage;
