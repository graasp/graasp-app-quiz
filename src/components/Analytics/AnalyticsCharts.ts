import { TFunction } from 'i18next';

import { ANSWER_REGEXP } from '../../utils/fillInTheBlanks';
import { formatInnerLink } from '../../utils/tableUtils';
import { Chart, FillTheBlanksAppDataData } from '../types/types';
import { QuestionType } from '../../config/constants';

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
export const generalCharts = (t: TFunction) =>
  adaptWithLink([
    {
      label: t('Quiz performance'),
      id: 'quiz-performance',
      chartType: GeneralChartType.QUIZ_PERFORMANCE,
      type: 'chart',
      link: '', // Will be replaced in the adaptWithLink 
    },
    {
      label: t('Users performance'),
      id: 'users-performance',
      chartType: GeneralChartType.USER_PERFORMANCE,
      type: 'chart',
      link: '', // Will be replaced in the adaptWithLink 
    },
    {
      label: t('Quiz correct response percentage'),
      id: 'quiz-correctness-percentage',
      chartType: GeneralChartType.QUIZ_CORRECT_PERCENTAGE,
      type: 'chart',
      link: '', // Will be replaced in the adaptWithLink 
    },
  ]);

/**
 * Function to get the fill in the blank detailed charts
 *
 * Return the chart along with its label, link and type. This list can then directly be used in the
 * AutoScrollableMenu component
 *
 * @param t The translation object, to localize the name of the chart
 * @param questionData The fill in the blank question, used to get the number of blank in the question, and return
 * the correct number of chart (i.e. one chart per blank)
 */
export const fillInTheBlankCharts = (
  t: TFunction,
  questionData: FillTheBlanksAppDataData
) => {
  const matched = questionData.text.match(ANSWER_REGEXP);

  if (matched) {
    return adaptWithLink(
      matched.map((_word: string, idx: number) => {
        return {
          label: `${t('Question answer frequency')} ${t('blank')} ${idx + 1}`,
          id: `${t('Question answer frequency')} ${t('blank')} ${idx + 1}`,
          chartType: DetailedChartType.ANSWER_FREQUENCY,
          chartIndex: idx,
          link: '', // Will be replaced in the adaptWithLink 
          type: QuestionType.FILL_BLANKS,
        };
      })
    );
  }

  return [];
};

/**
 * Function to get the multiple choices detailed charts
 *
 * Return the chart along with its label, link and type. This list can then directly be used in
 * theAutoScrollableMenu component
 *
 * @param t The translation object, to localize the name of the chart
 */
export const multipleChoicesCharts = (t: TFunction) =>
  adaptWithLink([
    {
      label: t('Question answer frequency'),
      // todo: use this id for building class and data-cy
      id: t('Question answer frequency'),
      chartType: DetailedChartType.ANSWER_FREQUENCY,
      link: '', // Will be replaced in the adaptWithLink 
      type: 'chart',
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
export const sliderCharts = (t: TFunction) =>
  adaptWithLink([
    {
      label: t('Question answer frequency'),
      // todo: use this id for building class and data-cy
      id: t('Question answer frequency'),
      chartType: DetailedChartType.ANSWER_FREQUENCY,
      type: 'chart',
      link: '', // Will be replaced in the adaptWithLink 
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
export const textInputCharts = (t: TFunction) =>
  adaptWithLink([
    {
      label: t('Question answer frequency'),
      // todo: use this id for building class and data-cy
      id: t('Question answer frequency'),
      chartType: DetailedChartType.ANSWER_FREQUENCY,
      type: 'chart',
      link: '', // Will be replaced in the adaptWithLink 
    },
  ]);

/**
 * Helper function to add the link property to the chart objet, to make it usable by the AutoScrollableMenu component
 *
 * @param charts The list of charts to which to add the link property
 */
const adaptWithLink = <T extends Chart>(charts: T[]) =>
  charts.map((chart) => {
    return {
      ...chart,
      link: formatInnerLink(chart.label),
    };
  });
