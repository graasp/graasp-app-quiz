import { ANSWER_REGEXP } from '../../utils/fillInTheBlanks';
import { formatInnerLink } from '../../utils/tableUtils';

/**
 * Object representing an enum of possible chart type, for the per-question detailed charts
 */
export const DetailedChartType = Object.freeze({
  ANSWER_FREQUENCY: Symbol('answerFreq'),
});

/**
 * Object representing an enum of possible chart type, for the general chart section
 */
export const GeneralChartType = Object.freeze({
  QUIZ_PERFORMANCE: Symbol('quizPerf'),
  USER_PERFORMANCE: Symbol('userPerf'),
  QUIZ_CORRECT_PERCENTAGE: Symbol('quizCorrectPercentage'),
});

/**
 * Function to get the general charts
 *
 * Return the chart along with its label, link and type. This list can then directly be used in the
 * AutoScrollableMenu component
 *
 * @param t The translation object, to localize the name of the chart
 */
export const generalCharts = (t) =>
  adaptWithLink([
    {
      label: t('Quiz performance'),
      chartType: GeneralChartType.QUIZ_PERFORMANCE,
    },
    {
      label: t('Users performance'),
      chartType: GeneralChartType.USER_PERFORMANCE,
    },
    {
      label: t('Quiz correct response percentage'),
      chartType: GeneralChartType.QUIZ_CORRECT_PERCENTAGE,
    },
  ]);

/**
 * Function to get the fill in the blank detailed charts
 *
 * Return the chart along with its label, link and type. This list can then directly be used in the
 * AutoScrollableMenu component
 *
 * @param t The translation object, to localize the name of the chart
 * @param question The fill in the blank question, used to get the number of blank in the question, and return
 * the correct number of chart (i.e. one chart per blank)
 */
export const fillInTheBlankCharts = (t, question) =>
  adaptWithLink(
    question.data.text.match(ANSWER_REGEXP).map((word, idx) => {
      return {
        label: `${t('Question answer frequency')} ${t('blank')} ${idx + 1}`,
        chartType: DetailedChartType.ANSWER_FREQUENCY,
        chartIndex: idx,
      };
    })
  );

/**
 * Function to get the multiple choices detailed charts
 *
 * Return the chart along with its label, link and type. This list can then directly be used in
 * theAutoScrollableMenu component
 *
 * @param t The translation object, to localize the name of the chart
 */
export const multipleChoicesCharts = (t) =>
  adaptWithLink([
    {
      label: t('Question answer frequency'),
      chartType: DetailedChartType.ANSWER_FREQUENCY,
    },
  ]);

/**
 * Function to get the slider detailed charts
 *
 * Return the chart along with its label, link and type. This list can then directly be used
 * in theAutoScrollableMenu component
 *
 * @param t The translation object, to localize the name of the chart
 */
export const sliderCharts = (t) =>
  adaptWithLink([
    {
      label: t('Question answer frequency'),
      chartType: DetailedChartType.ANSWER_FREQUENCY,
    },
  ]);

/**
 * Function to get the text input detailed charts
 *
 * Return the chart along with its label, link and type. This list can then directly be used
 * in theAutoScrollableMenu component
 *
 * @param t The translation object, to localize the name of the chart
 */
export const textInputCharts = (t) =>
  adaptWithLink([
    {
      label: t('Question answer frequency'),
      chartType: DetailedChartType.ANSWER_FREQUENCY,
    },
  ]);

/**
 * Helper function to add the link property to the chart objet, to make it usable by the AutoScrollableMenu component
 *
 * @param charts The list of charts to which to add the link property
 */
const adaptWithLink = (charts) =>
  charts.map((chart) => {
    return {
      ...chart,
      link: formatInnerLink(chart.label),
    };
  });
