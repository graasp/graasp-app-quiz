import { IconTestText } from '../utils/IconTestText';
import { HARPER_RESPONSES, LIAM_RESPONSES, MASON_RESPONSES } from './appData';
import {
  BABY_CAT_SETTING,
  CAPITAL_FRANCE_SETTING,
  FILL_BLANKS_SETTING_2,
  HAPPINESS_LEVEL_SETTING,
} from './appSettings';
import { HARPER, LIAM, MASON } from './members';

const toDateString = (date: string) => new Date(date).toDateString();

// TODO: add types
/**
 * Array containing the expected data for each table in the table by question page
 */
export const RESPONSES = {
  // Data first question
  [FILL_BLANKS_SETTING_2.data.question]: [
    {
      userId: HARPER.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
    {
      userId: LIAM.name,
      fields: {
        answer: LIAM_RESPONSES[2].data.text,
        date: toDateString(LIAM_RESPONSES[2].updatedAt),
        icon: IconTestText.CORRECT,
      },
    },
    {
      userId: MASON.name,
      fields: {
        answer: MASON_RESPONSES[0].data.text,
        date: toDateString(MASON_RESPONSES[0].updatedAt),
        icon: IconTestText.WRONG,
      },
    },
  ],
  // Data second question
  [HAPPINESS_LEVEL_SETTING.data.question]: [
    {
      userId: HARPER.name,
      fields: {
        answer: HARPER_RESPONSES[0].data.value,
        date: toDateString(HARPER_RESPONSES[0].updatedAt),
        icon: IconTestText.WRONG,
      },
    },
    {
      userId: LIAM.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
    {
      userId: MASON.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
  ],
  // Data third question
  [BABY_CAT_SETTING.data.question]: [
    {
      userId: HARPER.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
    {
      userId: LIAM.name,
      fields: {
        answer: LIAM_RESPONSES[1].data.text,
        date: toDateString(LIAM_RESPONSES[1].updatedAt),
        icon: IconTestText.WRONG,
      },
    },
    {
      userId: MASON.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
  ],
  // Data fourth question
  [CAPITAL_FRANCE_SETTING.data.question]: [
    {
      userId: HARPER.name,
      fields: {
        answer: HARPER_RESPONSES[1].data.choices.join(', '),
        date: toDateString(HARPER_RESPONSES[1].updatedAt),
        icon: IconTestText.WRONG,
      },
    },
    {
      userId: LIAM.name,
      fields: {
        answer: LIAM_RESPONSES[0].data.choices[0],
        date: toDateString(LIAM_RESPONSES[0].updatedAt),
        icon: IconTestText.CORRECT,
      },
    },
    {
      userId: MASON.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
  ],
};
