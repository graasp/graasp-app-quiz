import { mockItem } from './items';
import { mockMemberFactory, mockMultipleAppDataFactory } from './factories';

export const xavier = mockMemberFactory({
  id: 'mock-member-id-9',
  name: 'Xavier',
});

export const appDataXavier = mockMultipleAppDataFactory({
  item: mockItem,
  member: xavier,
  creator: xavier,
  payloads: [
    {
      data: {
        questionId: 'id11',
        choices: ['Brisbane'],
      },
      id: '37',
    },
    {
      data: {
        questionId: 'id21',
        choices: ['P'],
      },
      id: '40',
    },
    {
      data: {
        questionId: 'id31',
        value: 90,
      },
      id: '43',
    },
    {
      data: {
        questionId: 'id41',
        text: 'Vatican City',
      },
      id: '46',
    },
    {
      data: {
        questionId: 'id51',
        text: 'Roses are <blue>, violets are <sweet>, sugar is <red>.',
      },
      id: '49',
    },
    {
      data: {
        questionId: 'id61',
        choices: ['Saturn'],
      },
      id: '1137',
    },
    {
      data: {
        questionId: 'id71',
        choices: ['7'],
      },
      id: '1140',
    },
    {
      data: {
        questionId: 'id81',
        value: 7,
      },
      id: '1143',
    },
    {
      data: {
        questionId: 'id91',
        text: 'Moon',
      },
      id: '1146',
    },
    {
      data: {
        questionId: 'id101',
        text: 'All roads lead to <step>, and every journey begins with a single <Rome>.',
      },
      id: '1149',
    },
  ],
});
