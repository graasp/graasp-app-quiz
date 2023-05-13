/**
 * Function to get an object that defines how the information will be displayed on hovering the chart
 *
 * @param hoverText Array of string with info to display when overing different part of the chart
 * @param meta Array containing complementary information to be displayed along
 * @param template The template to display the text when hovering
 * @param borderColor The border color
 */
export const hoverData = (hoverText, meta, template, borderColor) => {
  return {
    hovertext: hoverText,
    meta,
    hovertemplate: template,
    hoverlabel: {
      bordercolor: borderColor,
      bgcolor: 'rgb(234,234,234)',
      align: 'left',
    },
  };
};

/**
 * Function to get an object containing some basics setting to use with charts
 *
 * @param fileName The name to give to the downloaded file of the chart
 */
export const defaultSettings = (fileName) => {
  return {
    displaylogo: false,
    scrollZoom: true,
    toImageButtonOptions: {
      filename: fileName,
    },
    responsive: true,
  };
};

/**
 * Function to get an object containing some basics property to use as chart layout
 *
 * @param title The title of the chart
 * @param width The width of the chart
 * @param maxValueX The max X value in the graph, used to display correct range (can be null)
 * @param maxValueY The max Y value in the graph, used to display correct range (can be null)
 */
export const defaultLayout = (title, width, maxValueX, maxValueY) => {
  return {
    autosize: true,
    title: {
      text: title,
    },
    yaxis: {
      range: maxValueX? [0, maxValueX] : [],
    },
    xaxis: {
      range: maxValueY? [0, maxValueY] : []
    },
    modebar: {
      orientation: 'h',
      remove: ['pan2d', 'lasso2d', 'select2d', 'zoom2d', 'autoScale2d'],
    },
    dragmode: 'pan',
    legend: {
      orientation: 'h',
      xanchor: 'center',
      x: 0.5,
    },
    showlegend: true,
    width,
    margin: {
      pad: 5
    }
  };
};
