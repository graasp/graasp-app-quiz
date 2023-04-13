export const MOCK_USER1_APP_DATA = [
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

export const MOCK_USER2_APP_DATA = [
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
    id: '5',
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
    id: '6',
  },
];

export const MOCK_USER3_APP_DATA = [
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
    id: '7',
  },
];

export const APP_DATA = [
  ...MOCK_USER1_APP_DATA,
  ...MOCK_USER2_APP_DATA,
  ...MOCK_USER3_APP_DATA,
];
