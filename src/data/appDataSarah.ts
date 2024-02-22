import { mockMemberFactory, mockMultipleAppDataFactory } from './factories';
import { mockItem } from './items';

export const sarah = mockMemberFactory({
  id: 'mock-member-id-2',
  name: 'Sarah',
});

export const appDataSarah = mockMultipleAppDataFactory({
  item: mockItem,
  member: sarah,
  creator: sarah,
  payloads: [
    {
      data: {
        questionId: 'id11',
        choices: ['Canberra'],
      },
      id: '2',
    },
    {
      data: {
        questionId: 'id21',
        choices: ['N'],
      },
      id: '9',
    },
    {
      data: {
        questionId: 'id31',
        value: 80,
      },
      id: '16',
    },
    {
      data: {
        questionId: 'id41',
        text: 'The Vatican',
      },
      id: '23',
    },
    {
      data: {
        questionId: 'id51',
        text: 'Roses are <red>, violets are <blue>, sugar is <sweet>.',
      },
      id: '30',
    },
    {
      data: {
        questionId: 'id61',
        choices: ['Mars'],
      },
      id: '112',
    },
    {
      data: {
        questionId: 'id71',
        choices: ['6'],
      },
      id: '119',
    },
    {
      data: {
        questionId: 'id81',
        value: 8,
      },
      id: '1116',
    },
    {
      data: {
        questionId: 'id91',
        text: 'Mars',
      },
      id: '1123',
    },
    {
      data: {
        questionId: 'id101',
        text: 'All roads lead to <Rome>, and every journey begins with a single <step>.',
      },
      id: '1130',
    },
  ],
});
