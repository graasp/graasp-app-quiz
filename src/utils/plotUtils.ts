import { ModeBarDefaultButtons } from 'plotly.js-basic-dist-min';

type HoverDataOptions<T> = {
  hoverText?: string[];
  meta?: T[];
  hoverTemplate?: string;
  borderColor?: string;
};

/**
 * Function to get an object that defines how the information will be displayed on hovering the chart
 *
 * @param hoverText Array of string with info to display when overing different part of the chart
 * @param meta Array containing complementary information to be displayed along
 * @param hoverTemplate The template to display the text when hovering
 * @param borderColor The border color
 */
export const hoverData = <T>({
  hoverText,
  meta,
  hoverTemplate,
  borderColor,
}: HoverDataOptions<T>) => {
  return {
    hovertext: hoverText,
    meta,
    hovertemplate: hoverTemplate,
    hoverlabel: {
      bordercolor: borderColor,
      bgcolor: 'rgb(234,234,234)',
      align: 'left' as const,
    },
  };
};

/**
 * Function to get an object containing some basics setting to use with charts
 *
 * @param fileName The name to give to the downloaded file of the chart
 */
export const defaultSettings = (fileName: string) => {
  return {
    displaylogo: false,
    scrollZoom: false, // It doesn't bring much now, so disable it, but let it here if we need it again
    toImageButtonOptions: {
      filename: fileName,
    },
  };
};

type DefaultLayoutOptions = {
  title: string;
  width: number;
  percentage: boolean;
  maxValueX?: number | null;
  maxValueY?: number | null;
};

/**
 * Function to get an object containing some basics property to use as chart layout
 *
 * @param title The title of the chart
 * @param width The width of the chart
 * @param percentage Set the y-axis in percentage if true
 * @param maxValueX The max X value in the graph, used to display correct range (can be null)
 * @param maxValueY The max Y value in the graph, used to display correct range (can be null)
 */
export const defaultLayout = ({
  title,
  width,
  percentage,
  maxValueX,
  maxValueY,
}: DefaultLayoutOptions) => {
  return {
    autosize: true,
    title: {
      text: title,
    },
    yaxis: {
      range: maxValueY ? [0, maxValueY] : [],
      ...(percentage ? { tickformat: ',.0%' } : {}),
    },
    xaxis: {
      range: maxValueX ? [0, maxValueX] : [],
    },
    modebar: {
      orientation: 'h' as const,
      remove: [
        'pan2d',
        'lasso2d',
        'select2d',
        'zoom2d',
        'autoScale2d',
      ] as ModeBarDefaultButtons[],
    },
    dragmode: 'pan' as const,
    legend: {
      orientation: 'h' as const,
      xanchor: 'center' as const,
      x: 0.5,
    },
    showlegend: true,
    width,
    margin: {
      pad: 5,
    },
  };
};

/**
 * Function to truncate text that are longer than a certain length
 *
 * @param text The text to truncate if too long
 * @param length The max length allowed before truncating the text
 */
export const truncateText = (text: string, length: number) =>
  text.length > length ? `${text.slice(0, length)}...` : text;
