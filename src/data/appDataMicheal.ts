import { mockMemberFactory, mockMultipleAppDataFactory } from './factories';
import { mockItem } from './items';

export const micheal = mockMemberFactory({
  id: 'mock-member-id-4',
  name: 'Micheal',
});

export const appDataMicheal = mockMultipleAppDataFactory({
  item: mockItem,
  member: micheal,
  creator: micheal,
  payloads: [
    {
      data: {
        questionId: 'id11',
        choices: ['Canberra'],
      },
      id: '4',
    },
    {
      data: {
        questionId: 'id21',
        choices: ['K'],
      },
      id: '11',
    },
    {
      data: {
        questionId: 'id41',
        text: 'Vatican City State',
      },
      id: '25',
    },
    {
      data: {
        questionId: 'id51',
        text: 'Roses are <blue>, violets are <red>, sugar is <sweet>.',
      },
      id: '32',
    },
    {
      data: {
        questionId: 'id61',
        choices: ['Venus'],
      },
      id: '114',
    },
    {
      data: {
        questionId: 'id71',
        choices: ['6'],
      },
      id: '1111',
    },
    {
      data: {
        questionId: 'id91',
        text: 'Moon',
      },
      id: '1125',
    },
    {
      data: {
        questionId: 'id101',
        text: 'All roads lead to <Rome>, and every journey begins with a single <step>.',
      },
      id: '1132',
    },
  ],
});
