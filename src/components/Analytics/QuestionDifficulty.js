import Plotly from 'plotly.js-basic-dist-min';

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import createPlotlyComponent from 'react-plotly.js/factory';

import { CircularProgress, useTheme } from '@mui/material';
import Box from '@mui/material/Box';

import { CHART_SECONDARY_COLOR } from '../../config/constants';
import { hooks } from '../../config/queryClient';
import {
  defaultLayout,
  defaultSettings,
  hoverData,
} from '../../utils/plotUtils';
import { QuizContext } from '../context/QuizContext';
import { computeCorrectness, getDataWithId } from '../context/utilities';

const Plot = createPlotlyComponent(Plotly);

const QuestionDifficulty = ({ maxWidth }) => {
  const { t } = useTranslation();
  const { data: responses, isLoading } = hooks.useAppData();
  const { questions } = useContext(QuizContext);
  const theme = useTheme();

  /**
   * Function to calculate the data to be displayed in the chart
   *
   * Returns an object that contains the data, and some additional information used to be displayed on the chart
   */
  const chartData = Array.from(
    responses.groupBy((r) => r.data.questionId)
  ).reduce(
    (acc, [id, list], idx) => {
      const question = getDataWithId(questions, id).data;
      const nbCorrectAndIncorrect = list.reduce(
        ([correct, incorrect], next) =>
          computeCorrectness(next.data, question)
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
          nbCorrectAndIncorrect[0] / list.size,
        ],
        percentageIncorrect: [
          ...acc.percentageIncorrect,
          nbCorrectAndIncorrect[1] / list.size,
        ],
        maxValue: Math.max(acc.maxValue, list.size),
        hoverText: [...acc.hoverText, question.question],
      };
    },
    {
      dataCorrect: { x: [], y: [] },
      dataIncorrect: { x: [], y: [] },
      percentageCorrect: [],
      percentageIncorrect: [],
      maxValue: 0,
      hoverText: [],
    }
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      <Plot
        data={[
          {
            name: t('Correct responses'),
            type: 'bar',
            ...chartData.dataCorrect,
            marker: {
              color: theme.palette.primary.main,
            },
            ...hoverData(
              chartData.hoverText,
              chartData.percentageCorrect,
              `%{hovertext}<br><br> - ${t(
                'Number of correct responses'
              )}: %{y} <br> - ${t(
                'Percentage correct responses'
              )}: %{meta:.1%} <extra></extra>`,
              theme.palette.primary.main
            ),
            texttemplate: '%{y}',
          },
          {
            name: t('Incorrect responses'),
            type: 'bar',
            ...chartData.dataIncorrect,
            marker: {
              color: CHART_SECONDARY_COLOR,
            },
            ...hoverData(
              chartData.hoverText,
              chartData.percentageIncorrect,
              `%{hovertext}<br><br> - ${t(
                'Number of incorrect responses'
              )}: %{y} <br> - ${t(
                'Percentage incorrect responses'
              )}: %{meta:.1%} <extra></extra>`,
              CHART_SECONDARY_COLOR
            ),
            texttemplate: '%{y}',
          },
        ]}
        layout={{
          ...defaultLayout(
            t('Number of correct/incorrect responses per question'),
            maxWidth,
            chartData.maxValue
          ),
          barmode: 'stack',
        }}
        config={{ ...defaultSettings('Nb_correct_responses') }}
        useResizeHandler
      />
    </Box>
  );
};

export default QuestionDifficulty;
