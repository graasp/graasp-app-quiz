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
  considerLastAttemptsOnly: boolean;
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
 * @param considerLastAttemptsOnly If true, the analytics are computed with the latest users' answers
 */
const CorrectResponsePerUser = ({
  maxWidth,
  responses,
  questions,
  members,
  considerLastAttemptsOnly,
}: Props) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const membersById = useMemo(() => groupBy(members, (m) => m.id), [members]);

  const questionsById = useMemo(
    () => groupBy(questions, (q) => q.data.questionId),
    [questions]
  );

  const chartData = useMemo(() => {
    const responsesByUser = groupBy(
      responses,
      (response) => response.member.id
    );

    return Object.entries(responsesByUser).reduce(
      (acc, [id, list]) => {
        const nbCorrect = list.reduce(
          (acc, next) =>
            computeCorrectness(
              getFirstOrUndefined(questionsById, next.data.questionId as string)
                ?.data as QuestionData,
              next.data as QuestionAppDataData
            )
              ? acc + 1
              : acc,
          0
        );

        const percent = considerLastAttemptsOnly
          ? nbCorrect / questions.length
          : nbCorrect / list.length;

        const member = membersById[id]?.at(0);

        if (!member) {
          return acc;
        }

        return {
          dataCorrect: {
            x: [...acc.dataCorrect.x, nbCorrect],
            y: [...acc.dataCorrect.y, member.name],
          },
          percentageCorrect: [...acc.percentageCorrect, percent],
          maxValue: Math.max(acc.maxValue, questions.length),
        };
      },
      {
        dataCorrect: { x: [], y: [] },
        percentageCorrect: [],
        maxValue: 0,
      } as ChartData
    );
  }, [
    considerLastAttemptsOnly,
    membersById,
    questions.length,
    questionsById,
    responses,
  ]);

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
