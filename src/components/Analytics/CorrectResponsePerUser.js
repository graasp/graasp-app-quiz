import { List } from 'immutable';
import Plotly from 'plotly.js-basic-dist-min';

import { useCallback, useContext, useEffect, useState } from 'react';
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
import { computeCorrectness } from '../context/utilities';

const Plot = createPlotlyComponent(Plotly);

const CorrectResponsePerUser = ({ maxWidth }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data, isLoading: isContextLoading } = hooks.useAppContext();
  const { data: responses, isLoading } = hooks.useAppData();
  const { questions } = useContext(QuizContext);

  const groupMemberById = useCallback(() => {
    return List(data?.members)?.groupBy((m) => m.id);
  }, [data]);

  const groupQuestionById = useCallback(() => {
    return questions?.groupBy((q) => q.id);
  }, [questions]);

  const [membersById, setMemberById] = useState(groupMemberById());
  const [questionsById, setQuestionsById] = useState(groupQuestionById());

  useEffect(() => {
    setMemberById(groupMemberById());
  }, [groupMemberById]);

  useEffect(() => {
    setQuestionsById(groupQuestionById());
  }, [groupQuestionById]);

  const chartData = Array.from(responses?.groupBy((r) => r.memberId)).reduce(
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
        percentageCorrect: [...acc.percentageCorrect, nbCorrect / list.size],
        maxValue: Math.max(acc.maxValue, list.size),
      };
    },
    {
      dataCorrect: { x: [], y: [] },
      percentageCorrect: [],
      maxValue: 0,
    }
  );

  if (isLoading || isContextLoading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
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
            ...hoverData(
              null,
              chartData.percentageCorrect,
              `%{y}<br><br> - ${t(
                'Number of correct responses'
              )}: %{x} <br> - ${t(
                'Percentage correct responses'
              )}: %{meta:.1%} <extra></extra>`,
              theme.palette.primary.main
            ),
            texttemplate: '%{x}',
            textangle: '0',
          },
        ]}
        layout={{
          ...defaultLayout(
            t('Number of correct responses per user'),
            maxWidth,
            undefined,
            chartData.maxValue
          ),
          yaxis: {
            automargin: true,
          },
        }}
        config={{ ...defaultSettings('Nb_correct_responses') }}
      ></Plot>
    </Box>
  );
};

export default CorrectResponsePerUser;
