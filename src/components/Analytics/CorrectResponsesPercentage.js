import Plotly from 'plotly.js-basic-dist-min';

import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createPlotlyComponent from 'react-plotly.js/factory';

import { CircularProgress, useTheme } from '@mui/material';
import Box from '@mui/material/Box';

import { hooks } from '../../config/queryClient';
import {
  defaultLayout,
  defaultSettings,
  hoverData,
} from '../../utils/plotUtils';
import { QuizContext } from '../context/QuizContext';
import { computeCorrectness, getDataWithId } from '../context/utilities';

const Plot = createPlotlyComponent(Plotly);

const CorrectResponsesPercentage = ({ maxWidth }) => {
  const { t } = useTranslation();
  const { data: responses, isLoading } = hooks.useAppData();
  const { questions, order } = useContext(QuizContext);
  const theme = useTheme();

  const getResponsesByQId = useCallback(() => {
    return responses.groupBy((r) => r.data.questionId);
  }, [responses]);
  const [responsesByQId, setResponsesByQId] = useState(getResponsesByQId());

  useEffect(() => {
    setResponsesByQId(getResponsesByQId());
  }, [getResponsesByQId]);

  const chartData = useMemo(() => {
    return order.reduce(
      (acc, qId, idx) => {
        const question = getDataWithId(questions, qId).data;
        const responses = responsesByQId.get(qId);
        const nbCorrect = responses.reduce(
          (acc, next) =>
            computeCorrectness(next.data, question) ? acc + 1 : acc,
          0
        );

        return {
          data: {
            x: [...acc.data.x, `Q${idx + 1}`],
            y: [...acc.data.y, nbCorrect / responses.size],
          },
          hoverText: [...acc.hoverText, question.question],
        };
      },
      {
        data: { x: [], y: [] },
        hoverText: [],
      }
    );
  }, [questions, responsesByQId, order]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Plot
        data={[
          {
            name: t('Quiz correct response percentage'),
            type: 'scatter',
            ...chartData.data,
            marker: {
              color: theme.palette.primary.main,
            },
            ...hoverData(
              chartData.hoverText,
              null,
              `%{hovertext}<br><br> - ${t(
                'Percentage correct responses'
              )}: %{y} <extra></extra>`,
              theme.palette.primary.main
            ),
            fill: 'tozeroy',
          },
        ]}
        layout={{
          ...defaultLayout(
            t('Quiz correct response percentage'),
            maxWidth,
            true,
            undefined,
            1.1
          ),
          xaxis: {
            range: [-0.2, order.length - 0.8],
          },
        }}
        config={{ ...defaultSettings('Quiz_correct_response_percentage') }}
      />
    </Box>
  );
};

export default CorrectResponsesPercentage;
