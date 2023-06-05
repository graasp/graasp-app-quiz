import { List } from 'immutable';
import Plotly from 'plotly.js-basic-dist-min';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import createPlotlyComponent from 'react-plotly.js/factory';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';

import { ANALYTICS_GENERAL_CORRECT_RESPONSE_PER_USER_CY } from '../../../config/selectors';
import {
  defaultLayout,
  defaultSettings,
  hoverData,
} from '../../../utils/plotUtils';
import { computeCorrectness } from '../../context/utilities';

const Plot = createPlotlyComponent(Plotly);

/**
 * Component that renders the correct response per user chart
 *
 * @param maxWidth the maximum width of the chart
 * @param responses The responses provided by the user to the quiz
 * @param questions The question for which to display detailed information
 * @param members The responses provided by the user to the quiz
 */
const CorrectResponsePerUser = ({
  maxWidth,
  responses,
  questions,
  members,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const membersById = useMemo(
    () => List(members)?.groupBy((m) => m.id),
    [members]
  );

  const questionsById = useMemo(() => {
    return questions?.groupBy((q) => q.id);
  }, [questions]);

  const chartData = useMemo(
    () =>
      Array.from(responses?.groupBy((response) => response.memberId)).reduce(
        (acc, [id, list]) => {
          const nbCorrect = list.reduce(
            (acc, next) =>
              computeCorrectness(
                next.data,
                questionsById?.get(next.data.questionId)?.first()?.data
              )
                ? acc + 1
                : acc,
            0
          );

          return {
            dataCorrect: {
              x: [...acc.dataCorrect.x, nbCorrect],
              y: [...acc.dataCorrect.y, membersById.get(id)?.first().name],
            },
            percentageCorrect: [
              ...acc.percentageCorrect,
              nbCorrect / list.size,
            ],
            maxValue: Math.max(acc.maxValue, list.size),
          };
        },
        {
          dataCorrect: { x: [], y: [] },
          percentageCorrect: [],
          maxValue: 0,
        }
      ),
    [membersById, questionsById, responses]
  );

  return (
    <Box
      sx={{ mt: 3, width: '100%' }}
      data-cy={ANALYTICS_GENERAL_CORRECT_RESPONSE_PER_USER_CY}
    >
      <Plot
        data={[
          {
            name: t('Correct responses'),
            type: 'bar',
            orientation: 'h',
            ...chartData.dataCorrect,
            marker: {
              color: theme.palette.primary.main,
            },
            ...hoverData({
              meta: chartData.percentageCorrect,
              hoverTemplate: `%{y}<br><br> - ${t(
                'Number of correct responses'
              )}: %{x} <br> - ${t(
                'Percentage correct responses'
              )}: %{meta:.1%} <extra></extra>`,
              borderColor: theme.palette.primary.main,
            }),
            texttemplate: '%{x}',
            textangle: '0',
          },
        ]}
        layout={{
          ...defaultLayout({
            title: t('Number of correct responses per user'),
            width: maxWidth,
            percentage: false,
            maxValueX: chartData.maxValue,
          }),
          yaxis: {
            automargin: true,
          },
        }}
        config={defaultSettings('Nb_correct_responses')}
      ></Plot>
    </Box>
  );
};

export default CorrectResponsePerUser;
