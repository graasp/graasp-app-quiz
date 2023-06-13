// I tried to fill all the member IDs by using the reference to "MEMBERS_RESULT_TABLES.MEMBER.id
// But for some reason, MEMBERS_RESULT_TABLES is undefined by the time the MOCK_USER are created

const item = { id: 'mock-item-id' };
const member = { id: 'mock-member-id-1', name: 'liam' };

export const LIAM_RESPONSES = [
  {
    item,
    member,
    creator: member,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '2',
  },
  {
    item,
    member,
    creator: member,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '3',
  },
  {
    item,
    member,
    creator: member,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id7',
      text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
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
    item,
    member,
    creator: member,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '5',
  },
  {
    item,
    member,
    creator: member,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '6',
  },
  {
    item,
    member,
    creator: member,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '7',
  },
];

const harper = { id: 'mock-member-id-2', name: 'harper' };

export const HARPER_RESPONSES = [
  {
    item,
    member: harper,
    creator: harper,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id5',
      value: 60,
    },
    id: '8',
  },
  {
    item,
    member: harper,
    creator: harper,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
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
    item,
    member: harper,
    creator: harper,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id9',
      text: '<1> + <2> = <1>',
    },
    id: '10',
  },
  {
    item,
    member: harper,
    creator: harper,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id10',
      choices: ['Jupiter'],
    },
    id: '11',
  },
  {
    item,
    member: harper,
    creator: harper,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id11',
      value: 2,
    },
    id: '12',
  },
];
const mason = { id: 'mock-member-id-3', name: 'mason' };
export const MASON_RESPONSES = [
  {
    item,
    member: mason,
    creator: mason,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id7',
      text: 'Lorem <suscipti> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <ipsum> sem.',
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
    item,
    member: mason,
    creator: mason,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '14',
  },
  {
    item,
    member: mason,
    creator: mason,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '15',
  },
  {
    item,
    member: mason,
    creator: mason,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '16',
  },
];

const isabella = { id: 'mock-member-id-4', name: 'isabella' };

export const ISABELLA_RESPONSES = [
  {
    item,
    member: isabella,
    creator: isabella,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '17',
  },
  {
    item,
    member: isabella,
    creator: isabella,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '18',
  },
  {
    item,
    member: isabella,
    creator: isabella,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id7',
      text: 'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <ipsum> ut fermentum nulla, sed <suscipit> sem.',
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
    item,
    member: isabella,
    creator: isabella,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '20',
  },
  {
    item,
    member: isabella,
    creator: isabella,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '21',
  },
  {
    item,
    member: isabella,
    creator: isabella,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '22',
  },
];
const ethan = { id: 'mock-member-id-5', name: 'ethan' };
export const ETHAN_RESPONSES = [
  {
    item,
    member: ethan,
    creator: ethan,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '23',
  },
  {
    item,
    member: ethan,
    creator: ethan,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '24',
  },
  {
    item,
    member: ethan,
    creator: ethan,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id7',
      text: 'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <ipsum> ut fermentum nulla, sed <suscipit> sem.',
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
    item,
    member: ethan,
    creator: ethan,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '26',
  },
  {
    item,
    member: ethan,
    creator: ethan,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '27',
  },
  {
    item,
    member: ethan,
    creator: ethan,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '28',
  },
];
const mia = { id: 'mock-member-id-6', name: 'mia' };
export const MIA_RESPONSES = [
  {
    item,
    member: mia,
    creator: mia,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '29',
  },
  {
    item,
    member: mia,
    creator: mia,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '30',
  },
  {
    item,
    member: mia,
    creator: mia,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id7',
      text: 'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <ipsum> ut fermentum nulla, sed <suscipit> sem.',
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
    item,
    member: mia,
    creator: mia,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '32',
  },
  {
    item,
    member: mia,
    creator: mia,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '33',
  },
  {
    item,
    member: mia,
    creator: mia,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '34',
  },
];

const alexander = { id: 'mock-member-id-7', name: 'alexander' };
export const ALEXANDER_RESPONSES = [
  {
    item,
    member: alexander,
    creator: alexander,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '35',
  },
  {
    item,
    member: alexander,
    creator: alexander,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '36',
  },
  {
    item,
    member: alexander,
    creator: alexander,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id7',
      text: 'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <ipsum> ut fermentum nulla, sed <suscipit> sem.',
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
    item,
    member: alexander,
    creator: alexander,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '38',
  },
  {
    item,
    member: alexander,
    creator: alexander,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '39',
  },
  {
    item,
    member: alexander,
    creator: alexander,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id11',
      value: 10,
    },
    id: '40',
  },
];
const chloe = { id: 'mock-member-id-8', name: 'chloe' };
export const CHLOE_RESPONSES = [
  {
    item,
    member: chloe,
    creator: chloe,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id4',
      choices: ['Paris'],
    },
    id: '41',
  },
  {
    item,
    member: chloe,
    creator: chloe,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id6',
      text: '90',
    },
    id: '42',
  },
  {
    item,
    member: chloe,
    creator: chloe,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id7',
      text: 'Lorem <Praesent> dolor sit amet, consectetur adipiscing elit. <ipsum> ut fermentum nulla, sed <suscipit> sem.',
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
    item,
    member: chloe,
    creator: chloe,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id9',
      text: '<1> + <1> = <2>',
    },
    id: '44',
  },
  {
    item,
    member: chloe,
    creator: chloe,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
    data: {
      questionId: 'id10',
      choices: ['Moon'],
    },
    id: '45',
  },
  {
    item,
    member: chloe,
    creator: chloe,
    createdAt: new Date('2022-07-22T12:35:50.195Z'),
    updatedAt: new Date('2022-07-22T12:36:51.741Z'),
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
