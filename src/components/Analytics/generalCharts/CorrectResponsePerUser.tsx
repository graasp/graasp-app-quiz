import groupBy from 'lodash.groupby';
import Plotly from 'plotly.js-basic-dist-min';

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import createPlotlyComponent from 'react-plotly.js/factory';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';

import { AppData, Member } from '@graasp/sdk';

import { ANALYTICS_GENERAL_CORRECT_RESPONSE_PER_USER_CY } from '../../../config/selectors';
import { getFirstOrUndefined } from '../../../utils/array';
import {
  defaultLayout,
  defaultSettings,
  hoverData,
} from '../../../utils/plotUtils';
import { computeCorrectness } from '../../context/utilities';
import {
  QuestionAppDataData,
  QuestionData,
  QuestionDataAppSetting,
} from '../../types/types';

const Plot = createPlotlyComponent(Plotly);

type Props = {
  maxWidth: number;
  responses: AppData[];
  questions: QuestionDataAppSetting[];
  members: Member[];
};

type ChartData = {
  dataCorrect: { x: number[]; y: string[] };
  percentageCorrect: number[];
  maxValue: number;
};

/**
 * Component that renders the correct response per user chart
 *
 * @param maxWidth the maximum width of the chart
 * @param responses The responses provided by the user to the quiz
 * @param questions The question for which to display detailed information
 * @param members The members who answered to the quiz
 */
const CorrectResponsePerUser = ({
  maxWidth,
  responses,
  questions,
  members,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const membersById = useMemo(() => groupBy(members, (m) => m.id), [members]);

  const questionsById = useMemo(() => {
    return groupBy(questions, (q) => q.data.questionId);
  }, [questions]);

  const chartData = useMemo(
    () =>
      Object.entries(
        groupBy(responses, (response) => response.member.id)
      ).reduce(
        (acc, [id, list]) => {
          console.log(list);
          const nbCorrect = list.reduce(
            (acc, next) =>
              computeCorrectness(
                getFirstOrUndefined(
                  questionsById,
                  next.data.questionId as string
                )?.data as QuestionData,
                next.data as QuestionAppDataData // TODO: avoid cast
              )
                ? acc + 1
                : acc,
            0
          );

          return {
            dataCorrect: {
              x: [...acc.dataCorrect.x, nbCorrect],
              y: [...acc.dataCorrect.y, membersById[id][0].name], // TODO: better manage this
            },
            // TODO: check what is the correct type
            percentageCorrect: [
              ...acc.percentageCorrect,
              nbCorrect / list.length,
            ],
            maxValue: Math.max(acc.maxValue, list.length),
          };
        },
        {
          dataCorrect: { x: [], y: [] },
          percentageCorrect: [],
          maxValue: 0,
        } as ChartData
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
            textangle: 'auto',
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
