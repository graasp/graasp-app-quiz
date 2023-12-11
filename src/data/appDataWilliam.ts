import { mockItem } from './items';
import { mockMemberFactory, mockMultipleAppDataFactory } from './factories';

export const william = mockMemberFactory({
  id: 'mock-member-id-6',
  name: 'William',
});

export const appDataWilliam = mockMultipleAppDataFactory({
  item: mockItem,
  member: william,
  creator: william,
  payloads: [
    {
      data: {
        questionId: 'id11',
        choices: ['Brisbane', 'Canberra'],
      },
      id: '6',
    },
    {
      data: {
        questionId: 'id21',
        choices: ['P'],
      },
      id: '13',
    },
    {
      data: {
        questionId: 'id71',
        choices: ['4'],
      },
      id: '1113',
    },
    {
      data: {
        questionId: 'id81',
        value: 4,
      },
      id: '1120',
    },
    {
      data: {
        questionId: 'id91',
        text: 'Moon',
      },
      id: '1127',
    },
  ],
});
