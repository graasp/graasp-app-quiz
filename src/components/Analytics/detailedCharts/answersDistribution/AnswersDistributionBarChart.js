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

/**
 * Component to display the answersDistribution into a bar chart given the received data
 *
 * @param maxWidth The max width of the question
 * @param chartData The data to display into the chart
 * @param questionName The name of the question, to add as title of the chart
 */
const AnswersDistributionBarChart = ({ maxWidth, chartData, questionName }) => {
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
            title: `${t('Answers distribution')} -<br>${questionName}`,
            width: maxWidth,
            percentage: false,
            maxValueY: chartData.maxValue,
          }),
          showlegend: false,
        }}
        config={defaultSettings(`${questionName}_Answer distribution`)}
      />
    </Box>
  );
};

export default AnswersDistributionBarChart;
