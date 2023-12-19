import { IconTestText } from '../utils/IconTestText';
import { HARPER_RESPONSES, LIAM_RESPONSES, MASON_RESPONSES } from './appData';
import {
  BABY_CAT_SETTING,
  CAPITAL_FRANCE_SETTING,
  FILL_BLANKS_SETTING_2,
  HAPPINESS_LEVEL_SETTING,
} from './appSettings';
import { MEMBERS_RESULT_TABLES } from './members';

// TODO: add types

/**
 * Array containing the expected data for each table in the table by question page
 */
export const RESPONSES = {
  // Data first question
  [FILL_BLANKS_SETTING_2.data.question]: [
    {
      userId: MEMBERS_RESULT_TABLES.HARPER.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
    {
      userId: MEMBERS_RESULT_TABLES.LIAM.name,
      fields: {
        answer: LIAM_RESPONSES[2].data.text,
        date: LIAM_RESPONSES[2].updatedAt,
        icon: IconTestText.CORRECT,
      },
    },
    {
      userId: MEMBERS_RESULT_TABLES.MASON.name,
      fields: {
        answer: MASON_RESPONSES[0].data.text,
        date: MASON_RESPONSES[0].updatedAt,
        icon: IconTestText.WRONG,
      },
    },
  ],
  // Data second question
  [HAPPINESS_LEVEL_SETTING.data.question]: [
    {
      userId: MEMBERS_RESULT_TABLES.HARPER.name,
      fields: {
        answer: HARPER_RESPONSES[0].data.value,
        date: HARPER_RESPONSES[0].updatedAt,
        icon: IconTestText.WRONG,
      },
    },
    {
      userId: MEMBERS_RESULT_TABLES.LIAM.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
    {
      userId: MEMBERS_RESULT_TABLES.MASON.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
  ],
  // Data third question
  [BABY_CAT_SETTING.data.question]: [
    {
      userId: MEMBERS_RESULT_TABLES.HARPER.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
    {
      userId: MEMBERS_RESULT_TABLES.LIAM.name,
      fields: {
        answer: LIAM_RESPONSES[1].data.text,
        date: LIAM_RESPONSES[1].updatedAt,
        icon: IconTestText.WRONG,
      },
    },
    {
      userId: MEMBERS_RESULT_TABLES.MASON.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
  ],
  // Data fourth question
  [CAPITAL_FRANCE_SETTING.data.question]: [
    {
      userId: MEMBERS_RESULT_TABLES.HARPER.name,
      fields: {
        answer: HARPER_RESPONSES[1].data.choices.join(', '),
        date: HARPER_RESPONSES[1].updatedAt,
        icon: IconTestText.WRONG,
      },
    },
    {
      userId: MEMBERS_RESULT_TABLES.LIAM.name,
      fields: {
        answer: LIAM_RESPONSES[0].data.choices[0],
        date: LIAM_RESPONSES[0].updatedAt,
        icon: IconTestText.CORRECT,
      },
    },
    {
      userId: MEMBERS_RESULT_TABLES.MASON.name,
      fields: {
        answer: 'Not yet answered',
      },
    },
  ],
};
