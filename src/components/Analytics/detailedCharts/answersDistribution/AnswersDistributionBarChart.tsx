import Plotly from 'plotly.js-basic-dist-min';

import { useTranslation } from 'react-i18next';
import createPlotlyComponent from 'react-plotly.js/factory';

import { Box, useTheme } from '@mui/material';

import {
  defaultLayout,
  defaultSettings,
  hoverData,
} from '../../../../utils/plotUtils';
import { ChartData } from '../../../types/types';

const Plot = createPlotlyComponent(Plotly);

type Props = {
  maxWidth: number;
  chartData: ChartData;
  questionName: string;
};

/**
 * Component to display the answersDistribution into a bar chart given the received data
 *
 * @param maxWidth The max width of the question
 * @param chartData The data to display into the chart
 * @param questionName The name of the question, to add as title of the chart
 */
const AnswersDistributionBarChart = ({
  maxWidth,
  chartData,
  questionName,
}: Props) => {
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
              color: chartData.barColors ?? theme.palette.primary.main, // can be string | string[]
            },
            ...hoverData({
              hoverText: chartData?.hoverText,
              meta: chartData.percentage,
              hoverTemplate: `%{hovertext}<br><br> - ${t(
                'Number of time selected'
              )}: %{y} <br> - ${t(
                'Percentage number of time selected'
              )}: %{meta:.1%} <extra></extra>`,
              borderColor: chartData.barColors.at(0) ?? theme.palette.primary.main, // TODO: check why string[]
            }),
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
