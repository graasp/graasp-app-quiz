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
} from '../../../../utils/plotUtils';

const Plot = createPlotlyComponent(Plotly);

const AnswersDistributionSlider = ({
  maxWidth,
  question,
  appDataForQuestion,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const getResponsesByValue = useCallback(() => {
    return appDataForQuestion.groupBy((r) => r.data.value);
  }, [appDataForQuestion]);

  const [responsesByValue, setResponsesByValue] = useState(
    getResponsesByValue()
  );

  useEffect(
    () => setResponsesByValue(getResponsesByValue()),
    [getResponsesByValue]
  );

  const chartData = Array.from(responsesByValue)
    .sort(([val1], [val2]) => {
      if (val1 < val2) {
        return -1;
      } else if (val1 > val2) {
        return 1;
      } else {
        return 0;
      }
    })
    .reduce(
      (acc, [value, list], idx) => {
        return {
          data: {
            x: [...acc.data.x, value],
            y: [...acc.data.y, list.size],
          },
          percentage: [...acc.percentage, list.size / appDataForQuestion.size],
          maxNbAnswers: Math.max(acc.maxNbAnswers, list.size),
          maxValue: Math.max(acc.maxValue, value),
          minValue: Math.min(acc.minValue, value),
        };
      },
      {
        data: { x: [], y: [] },
        percentage: [],
        maxNbAnswers: 0,
        maxValue: Number.MIN_VALUE,
        minValue: Number.MAX_VALUE,
      }
    );

  return (
    <Box sx={{ width: '100%' }}>
      <Plot
        data={[
          {
            name: t('Number of answers'),
            type: 'scatter',
            ...chartData.data,
            marker: {
              color: theme.palette.primary.main,
              size: 10,
            },
            ...hoverData(
              null,
              chartData.percentage,
              `%{x}<br><br> - ${t('Number of time selected')}: %{y} <br> - ${t(
                'Percentage number of time selected'
              )}: %{meta:.1%} <extra></extra>`,
              theme.palette.primary.main
            ),
            fill: 'tozeroy',
          },
        ]}
        layout={{
          ...defaultLayout(
            `${t('Answers distribution')} -<br> ${question.data.question}`,
            maxWidth,
            false,
            undefined,
            chartData.maxNbAnswers + 0.2
          ),
          xaxis: {
            range: [chartData.minValue - 0.2, chartData.maxValue + 0.2],
          },
        }}
        config={{
          ...defaultSettings(`${question.data.question}_Answer distribution`),
        }}
      />
    </Box>
  );
};

export default AnswersDistributionSlider;
