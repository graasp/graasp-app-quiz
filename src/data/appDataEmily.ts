import { mockMemberFactory, mockMultipleAppDataFactory } from './factories';
import { mockItem } from './items';

export const emily = mockMemberFactory({
  id: 'mock-member-id-3',
  name: 'Emily',
});

export const appDataEmily = mockMultipleAppDataFactory({
  item: mockItem,
  member: emily,
  creator: emily,
  payloads: [
    {
      data: {
        questionId: 'id11',
        choices: ['Brisbane'],
      },
      id: '3',
    },
    {
      data: {
        questionId: 'id21',
        choices: ['O'],
      },
      id: '10',
    },
    {
      data: {
        questionId: 'id31',
        value: 118,
      },
      id: '17',
    },
    {
      data: {
        questionId: 'id41',
        text: 'Vatican',
      },
      id: '24',
    },
    {
      data: {
        questionId: 'id51',
        text: 'Roses are <sweet>, violets are <blue>, sugar is <red>.',
      },
      id: '31',
    },
    {
      data: {
        questionId: 'id61',
        choices: ['Jupiter'],
      },
      id: '113',
    },
    {
      data: {
        questionId: 'id81',
        value: 15,
      },
      id: '1117',
    },
    {
      data: {
        questionId: 'id91',
        text: 'Venus',
      },
      id: '1124',
    },
    {
      data: {
        questionId: 'id101',
        text: 'All roads lead to <Rome>, and every journey begins with a single <step>.',
      },
      id: '1131',
    },
  ],
});
