import Plotly from 'plotly.js-basic-dist-min';

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
const AnswersDistributionBarChart = ({ maxWidth, chartData, question }) => {
  const { t } = useTranslation();
  const theme = useTheme();

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
              chartData?.hoverText,
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
          ...defaultLayout({
            title: `${t('Answers distribution')} -<br>${
              question.data.question
            }`,
            width: maxWidth,
            percentage: false,
            maxValueY: chartData.maxValue,
          }),
          showlegend: false,
        }}
        config={{
          ...defaultSettings(`${question.data.question}_Answer distribution`),
        }}
      />
    </Box>
  );
};

export default AnswersDistributionBarChart;
