// I tried to fill all the member IDs by using the reference to "MEMBERS_RESULT_TABLES.MEMBER.id
// But for some reason, MEMBERS_RESULT_TABLES is undefined by the time the MOCK_USER are created
import {
  mockMemberFactory,
  mockMultipleAppDataFactory,
} from '../../src/data/factories';
import { mockItem } from '../../src/data/items';

// TODO: move members or merge them ?
const member = mockMemberFactory({ id: 'mock-member-id-1', name: 'liam' });

export const LIAM_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: member,
  payloads: [
    {
      data: {
        questionId: 'id41',
        choices: ['Paris'],
      },
      id: '2',
    },
    {
      data: {
        questionId: 'id61',
        text: '90',
      },
      id: '3',
    },
    {
      data: {
        questionId: 'id71',
        text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
      },
      id: '4',
    },
  ],
});

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const LIAM_MORE_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: member,
  payloads: [
    {
      data: {
        questionId: 'id91',
        text: '<1> + <1> = <2>',
      },
      id: '5',
    },
    {
      data: {
        questionId: 'id101',
        choices: ['Moon'],
      },
      id: '6',
    },
    {
      data: {
        questionId: 'id111',
        value: 10,
      },
      id: '7',
    },
  ],
});

const harper = mockMemberFactory({ id: 'mock-member-id-2', name: 'harper' });

export const HARPER_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: harper,
  payloads: [
    {
      data: {
        questionId: 'id51',
        value: 60,
      },
      id: '8',
    },
    {
      data: {
        questionId: 'id41',
        choices: ['Tokyo', 'London'],
      },
      id: '9',
    },
  ],
});

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const HARPER_MORE_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: harper,
  payloads: [
    {
      data: {
        questionId: 'id91',
        text: '<1> + <2> = <1>',
      },
      id: '10',
    },
    {
      data: {
        questionId: 'id101',
        choices: ['Jupiter'],
      },
      id: '11',
    },
    {
      data: {
        questionId: 'id111',
        value: 2,
      },
      id: '12',
    },
  ],
});

const mason = mockMemberFactory({ id: 'mock-member-id-3', name: 'mason' });
export const MASON_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: mason,
  payloads: [
    {
      data: {
        questionId: 'id71',
        text: 'Lorem <suscipti> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <ipsum> sem.',
      },
      id: '13',
    },
  ],
});

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const MASON_MORE_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: mason,
  payloads: [
    {
      data: {
        questionId: 'id91',
        text: '<1> + <1> = <2>',
      },
      id: '14',
    },
    {
      data: {
        questionId: 'id101',
        choices: ['Moon'],
      },
      id: '15',
    },
    {
      data: {
        questionId: 'id111',
        value: 10,
      },
      id: '16',
    },
  ],
});

const isabella = mockMemberFactory({
  id: 'mock-member-id-4',
  name: 'isabella',
});

export const ISABELLA_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: isabella,
  payloads: [
    {
      data: {
        questionId: 'id41',
        choices: ['Paris'],
      },
      id: '17',
    },
    {
      data: {
        questionId: 'id61',
        text: '90',
      },
      id: '18',
    },
    {
      data: {
        questionId: 'id71',
        text: 'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <ipsum> ut fermentum nulla, sed <suscipit> sem.',
      },
      id: '19',
    },
  ],
});

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const ISABELLA_MORE_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: isabella,
  payloads: [
    {
      data: {
        questionId: 'id91',
        text: '<1> + <1> = <2>',
      },
      id: '20',
    },
    {
      data: {
        questionId: 'id101',
        choices: ['Moon'],
      },
      id: '21',
    },
    {
      data: {
        questionId: 'id111',
        value: 10,
      },
      id: '22',
    },
  ],
});
const ethan = mockMemberFactory({ id: 'mock-member-id-5', name: 'ethan' });
export const ETHAN_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: ethan,
  payloads: [
    {
      data: {
        questionId: 'id41',
        choices: ['Paris'],
      },
      id: '23',
    },
    {
      data: {
        questionId: 'id61',
        text: '90',
      },
      id: '24',
    },
    {
      data: {
        questionId: 'id71',
        text: 'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <ipsum> ut fermentum nulla, sed <suscipit> sem.',
      },
      id: '25',
    },
  ],
});

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const ETHAN_MORE_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: ethan,
  payloads: [
    {
      data: {
        questionId: 'id91',
        text: '<1> + <1> = <2>',
      },
      id: '26',
    },
    {
      data: {
        questionId: 'id101',
        choices: ['Moon'],
      },
      id: '27',
    },
    {
      data: {
        questionId: 'id111',
        value: 10,
      },
      id: '28',
    },
  ],
});

const mia = mockMemberFactory({ id: 'mock-member-id-6', name: 'mia' });
const MIA_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: mia,
  payloads: [
    {
      data: {
        questionId: 'id41',
        choices: ['Paris'],
      },
      id: '29',
    },
    {
      data: {
        questionId: 'id61',
        text: '90',
      },
      id: '30',
    },
    {
      data: {
        questionId: 'id71',
        text: 'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <ipsum> ut fermentum nulla, sed <suscipit> sem.',
      },
      id: '31',
    },
  ],
});

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
const MIA_MORE_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: mia,
  payloads: [
    {
      data: {
        questionId: 'id91',
        text: '<1> + <1> = <2>',
      },
      id: '32',
    },
    {
      data: {
        questionId: 'id101',
        choices: ['Moon'],
      },
      id: '33',
    },
    {
      data: {
        questionId: 'id111',
        value: 10,
      },
      id: '34',
    },
  ],
});

const alexander = mockMemberFactory({
  id: 'mock-member-id-7',
  name: 'alexander',
});
const ALEXANDER_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: alexander,
  payloads: [
    {
      data: {
        questionId: 'id41',
        choices: ['Paris'],
      },
      id: '35',
    },
    {
      data: {
        questionId: 'id61',
        text: '90',
      },
      id: '36',
    },
    {
      data: {
        questionId: 'id71',
        text: 'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <ipsum> ut fermentum nulla, sed <suscipit> sem.',
      },
      id: '37',
    },
  ],
});

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
const ALEXANDER_MORE_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: alexander,
  payloads: [
    {
      data: {
        questionId: 'id91',
        text: '<1> + <1> = <2>',
      },
      id: '38',
    },
    {
      data: {
        questionId: 'id101',
        choices: ['Moon'],
      },
      id: '39',
    },
    {
      data: {
        questionId: 'id111',
        value: 10,
      },
      id: '40',
    },
  ],
});

const chloe = mockMemberFactory({ id: 'mock-member-id-8', name: 'chloe' });
const CHLOE_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: chloe,
  payloads: [
    {
      data: {
        questionId: 'id41',
        choices: ['Paris'],
      },
      id: '41',
    },
    {
      data: {
        questionId: 'id61',
        text: '90',
      },
      id: '42',
    },
    {
      data: {
        questionId: 'id71',
        text: 'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <ipsum> ut fermentum nulla, sed <suscipit> sem.',
      },
      id: '43',
    },
  ],
});

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
const CHLOE_MORE_RESPONSES = mockMultipleAppDataFactory({
  item: mockItem,
  creator: chloe,
  payloads: [
    {
      data: {
        questionId: 'id91',
        text: '<1> + <1> = <2>',
      },
      id: '44',
    },
    {
      data: {
        questionId: 'id101',
        choices: ['Moon'],
      },
      id: '45',
    },
    {
      data: {
        questionId: 'id111',
        value: 10,
      },
      id: '46',
    },
  ],
});

/**
 * Basic app data(i.e. user responses) used to test that display is good in table by user and by questions
 */
export const APP_DATA_FEW_QUESTIONS_FEW_USERS = [
  ...LIAM_RESPONSES,
  ...HARPER_RESPONSES,
  ...MASON_RESPONSES,
];

/**
 * App data with more user to make te table bigger, and make it easier to test the scroll behaviour in
 * table by question
 */
export const APP_DATA_FEW_QUESTIONS_LOT_USERS = [
  ...LIAM_RESPONSES,
  ...HARPER_RESPONSES,
  ...MASON_RESPONSES,
  ...ISABELLA_RESPONSES,
  ...ETHAN_RESPONSES,
  ...MIA_RESPONSES,
  ...ALEXANDER_RESPONSES,
  ...CHLOE_RESPONSES,
];

/**
 * App data with more users and responses, to make it easier to test the scroll behaviour in table by user
 */
export const APP_DATA_LOT_QUESTIONS_LOT_USERS = [
  ...LIAM_RESPONSES,
  ...LIAM_MORE_RESPONSES,
  ...HARPER_RESPONSES,
  ...HARPER_MORE_RESPONSES,
  ...MASON_RESPONSES,
  ...MASON_MORE_RESPONSES,
  ...ISABELLA_RESPONSES,
  ...ISABELLA_MORE_RESPONSES,
  ...ETHAN_RESPONSES,
  ...ETHAN_MORE_RESPONSES,
  ...MIA_RESPONSES,
  ...MIA_MORE_RESPONSES,
  ...ALEXANDER_RESPONSES,
  ...ALEXANDER_MORE_RESPONSES,
  ...CHLOE_RESPONSES,
  ...CHLOE_MORE_RESPONSES,
];
