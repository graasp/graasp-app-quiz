import Plotly from 'plotly.js-basic-dist-min';

import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createPlotlyComponent from 'react-plotly.js/factory';

import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';

import {
  defaultLayout,
  defaultSettings,
  hoverData,
  truncateText,
} from '../../../../utils/plotUtils';

const Plot = createPlotlyComponent(Plotly);

const AnswersDistributionMultipleChoices = ({
  maxWidth,
  question,
  appDataForQuestion,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const getResponsesByChoices = useCallback(() => {
    return appDataForQuestion
      .map((r) => {
        return {
          ...r,
          data: {
            ...r.data,
            choices: r.data.choices.join(', '),
          },
        };
      })
      .groupBy((r) => r.data.choices);
  }, [appDataForQuestion]);

  const [responsesByChoices, setResponsesByChoices] = useState(
    getResponsesByChoices()
  );

  useEffect(
    () => setResponsesByChoices(getResponsesByChoices()),
    [getResponsesByChoices]
  );

  const chartData = Array.from(responsesByChoices).reduce(
    (acc, [choices, list], idx) => {
      return {
        data: {
          x: [...acc.data.x, `A${idx + 1} <br> ${truncateText(choices, 10)}`], //
          y: [...acc.data.y, list.size],
        },
        percentage: [...acc.percentage, list.size / appDataForQuestion.size],
        maxValue: Math.max(acc.maxValue, list.size),
        hoverText: [...acc.hoverText, choices],
      };
    },
    {
      data: { x: [], y: [] },
      percentage: [],
      maxValue: 0,
      hoverText: [],
    }
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Plot
        data={[
          {
            name: t('Number of answers'),
            type: 'bar',
            ...chartData.data,
            marker: {
              color: theme.palette.primary.main,
            },
            ...hoverData(
              chartData.hoverText,
              chartData.percentage,
              `%{hovertext}<br><br> - ${t(
                'Number of time selected'
              )}: %{y} <br> - ${t(
                'Percentage number of time selected'
              )}: %{meta:.1%} <extra></extra>`,
              theme.palette.primary.main
            ),
            texttemplate: '%{y}',
          },
        ]}
        layout={{
          ...defaultLayout(
            `${t('Answers distribution')} - <br> ${question.data.question}`,
            maxWidth,
            false,
            undefined,
            chartData.maxValue
          ),
          showlegend: false,
        }}
        config={{
          ...defaultSettings(`${question.data.question}_Answer distribution`),
        }}
      />
    </Box>
  );
};

export default AnswersDistributionMultipleChoices;
