// I tried to fill all the member IDs by using the reference to "MEMBERS_RESULT_TABLES['mock-member-id-xxx'].id
// But for some reason, MEMBERS_RESULT_TABLES is undefined by the time the MOCK_USER are created
export const LIAM_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-1',
    creator: 'mock-member-id-1',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '2',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-1',
    creator: 'mock-member-id-1',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '3',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-1',
    creator: 'mock-member-id-1',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id7',
      text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
    },
    id: '4',
  },
];

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const LIAM_MORE_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-1',
    creator: 'mock-member-id-1',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '5',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-1',
    creator: 'mock-member-id-1',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '6',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-1',
    creator: 'mock-member-id-1',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '7',
  },
];

export const HARPER_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-2',
    creator: 'mock-member-id-2',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id5',
      value: 60,
    },
    id: '8',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-2',
    creator: 'mock-member-id-2',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id4',
      choices: ['Tokyo', 'London'],
    },
    id: '9',
  },
];

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const HARPER_MORE_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-2',
    creator: 'mock-member-id-2',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id9',
      text: '<1> + <2> = <1>',
    },
    id: '10',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-2',
    creator: 'mock-member-id-2',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id10',
      choices: ['Jupiter'],
    },
    id: '11',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-2',
    creator: 'mock-member-id-2',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id11',
      value: 2,
    },
    id: '12',
  },
];

export const MASON_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-3',
    creator: 'mock-member-id-3',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id7',
      text: 'Lorem <suscipti> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <ip sum> sem.',
    },
    id: '13',
  },
];

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const MASON_MORE_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-3',
    creator: 'mock-member-id-3',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '14',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-3',
    creator: 'mock-member-id-3',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '15',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-3',
    creator: 'mock-member-id-3',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '16',
  },
];

export const ISABELLA_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-4',
    creator: 'mock-member-id-4',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '17',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-4',
    creator: 'mock-member-id-4',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '18',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-4',
    creator: 'mock-member-id-4',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id7',
      text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
    },
    id: '19',
  },
];

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const ISABELLA_MORE_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-4',
    creator: 'mock-member-id-4',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '20',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-4',
    creator: 'mock-member-id-4',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '21',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-4',
    creator: 'mock-member-id-4',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '22',
  },
];

export const ETHAN_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-5',
    creator: 'mock-member-id-5',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '23',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-5',
    creator: 'mock-member-id-5',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '24',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-5',
    creator: 'mock-member-id-5',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id7',
      text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
    },
    id: '25',
  },
];

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const ETHAN_MORE_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-5',
    creator: 'mock-member-id-5',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '26',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-5',
    creator: 'mock-member-id-5',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '27',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-5',
    creator: 'mock-member-id-5',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '28',
  },
];

export const MIA_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-6',
    creator: 'mock-member-id-6',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '29',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-6',
    creator: 'mock-member-id-6',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '30',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-6',
    creator: 'mock-member-id-6',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id7',
      text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
    },
    id: '31',
  },
];

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const MIA_MORE_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-6',
    creator: 'mock-member-id-6',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '32',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-6',
    creator: 'mock-member-id-6',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '33',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-6',
    creator: 'mock-member-id-6',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '34',
  },
];

export const ALEXANDER_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-7',
    creator: 'mock-member-id-7',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '35',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-7',
    creator: 'mock-member-id-7',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '36',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-7',
    creator: 'mock-member-id-7',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id7',
      text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
    },
    id: '37',
  },
];

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const ALEXANDER_MORE_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-7',
    creator: 'mock-member-id-7',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '38',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-7',
    creator: 'mock-member-id-7',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '39',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-7',
    creator: 'mock-member-id-7',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '40',
  },
];

export const CHLOE_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-8',
    creator: 'mock-member-id-8',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '41',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-8',
    creator: 'mock-member-id-8',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '42',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-8',
    creator: 'mock-member-id-8',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id7',
      text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
    },
    id: '43',
  },
];

/**
 * Those additional responses are used to enlarge the tables, to ensure that it takes the whole screen,
 * and make things easier to test the scroll behaviour
 */
export const CHLOE_MORE_RESPONSES = [
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-8',
    creator: 'mock-member-id-8',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '44',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-8',
    creator: 'mock-member-id-8',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '45',
  },
  {
    itemId: 'mock-item-id',
    memberId: 'mock-member-id-8',
    creator: 'mock-member-id-8',
    createdAt: '2022-07-22T12:35:50.195Z',
    updatedAt: '2022-07-22T12:36:51.741Z',
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '46',
  },
];

/**
 * Basic app data(i.e. user responses) used to test that display is good in table by user and by questions
 */
export const APP_DATA = [
  ...LIAM_RESPONSES,
  ...HARPER_RESPONSES,
  ...MASON_RESPONSES,
];

/**
 * App data with more user to make te table bigger, and make it easier to test the scroll behaviour in
 * table by question
 */
export const APP_DATA_2 = [
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
export const APP_DATA_3 = [
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
