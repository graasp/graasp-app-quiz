import { mockMemberFactory, mockMultipleAppDataFactory } from './factories';
import { mockItem } from './items';

export const luca = mockMemberFactory({
  id: 'mock-member-id-10',
  name: 'Luca',
});

export const appDataLuca = mockMultipleAppDataFactory({
  item: mockItem,
  member: luca,
  creator: luca,
  payloads: [
    {
      data: {
        questionId: 'id11',
        choices: ['Canberra'],
      },
      id: '38',
    },
    {
      data: {
        questionId: 'id21',
        choices: ['O'],
      },
      id: '41',
    },
    {
      data: {
        questionId: 'id31',
        value: 100,
      },
      id: '44',
    },
    {
      data: {
        questionId: 'id41',
        text: 'Vatican City',
      },
      id: '47',
    },
    {
      data: {
        questionId: 'id51',
        text: 'Roses are <sweet>, violets are <red>, sugar is <blue>.',
      },
      id: '50',
    },
    {
      data: {
        questionId: 'id61',
        choices: ['Saturn'],
      },
      id: '1138',
    },
    {
      data: {
        questionId: 'id81',
        value: 8,
      },
      id: '1144',
    },
    {
      data: {
        questionId: 'id101',
        text: 'All roads lead to <Rome>, and every journey begins with a single <step>.',
      },
      id: '1150',
    },
  ],
});
