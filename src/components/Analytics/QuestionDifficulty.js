import Plotly from 'plotly.js-basic-dist-min';

import { useContext, useEffect, useRef, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';

import { CircularProgress, useTheme } from '@mui/material';
import Box from '@mui/material/Box';

import { hooks } from '../../config/queryClient';
import { useElementWidth } from '../../hooks/useElementWidth';
import { QuizContext } from '../context/QuizContext';
import { computeCorrectness, getDataWithId } from '../context/utilities';
import {
  defaultLayout,
  defaultSettings,
  hoverData,
} from './plotUtils/plotUtils';

const Plot = createPlotlyComponent(Plotly);

const QuestionDifficulty = () => {
  const { data: responses, isLoading } = hooks.useAppData();
  const { questions } = useContext(QuizContext);
  const theme = useTheme();
  const plotContainerElem = useRef(null);

  const plotContainerElemWidth = useElementWidth(plotContainerElem.current);

  // TODO Trick to force react to re-render, is there a Better way to do ??
  const [, updateState] = useState(plotContainerElemWidth);
  useEffect(() => {
    updateState(plotContainerElemWidth);
  }, [plotContainerElemWidth]);

  /**
   * Helper function to split a string at every other space
   * Used, as plotly js is not able to automatically wrap long string
   */
  //const splitSecondSpace = useCallback((string) => {
  //  return string.replace(/([^ ]* [^ ]*)( )/g, '$1<br>')
  //}, [])

  /**
   * Function to calculate the data to be displayed in the chart
   *
   * Returns an object that contains the data, and some additional information used to be displayed on the chart
   */
  const correctResponseChartData = Array.from(
    responses.groupBy((r) => r.data.questionId)
  ).reduce(
    (acc, [id, list], idx) => {
      const question = getDataWithId(questions, id).data;
      const nbCorrectResponses = list.reduce(
        (acc, next) =>
          computeCorrectness(next.data, question) ? acc + 1 : acc,
        0
      );

      return {
        data: {
          x: [
            ...acc.data.x,
            /*splitSecondSpace(`${question.question}-${id}`)*/ `Q${idx + 1}`,
          ],
          y: [...acc.data.y, nbCorrectResponses],
        },
        percentageCorrect: [
          ...acc.percentageCorrect,
          nbCorrectResponses / list.size,
        ],
        maxValue: Math.max(acc.maxValue, list.size),
        hoverText: [...acc.hoverText, question.question],
      };
    },
    {
      data: { x: [], y: [] },
      percentageCorrect: [],
      maxValue: 0,
      hoverText: [],
    }
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ mt: 3 }} ref={plotContainerElem}>
      <Plot
        data={[
          {
            name: 'Correct responses',
            type: 'bar',
            ...correctResponseChartData.data,
            marker: {
              color: theme.palette.primary.main,
            },
            ...hoverData(
              correctResponseChartData.hoverText,
              correctResponseChartData.percentageCorrect,
              '%{hovertext}<br><br> - Number of correct responses: %{y} <br> - Percentage correct responses: %{meta:.1%} <extra></extra>',
              theme
            ),
          },
        ]}
        layout={{
          ...defaultLayout(
            'Number of correct responses per question',
            plotContainerElemWidth,
            correctResponseChartData.maxValue
          ),
        }}
        config={{ ...defaultSettings('Nb_correct_responses') }}
        useResizeHandler
      />
    </Box>
  );
};

export default QuestionDifficulty;
