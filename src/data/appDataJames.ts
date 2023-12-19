import { mockItem } from './items';
import { mockMemberFactory, mockMultipleAppDataFactory } from './factories';

export const james = mockMemberFactory({
  id: 'mock-member-id-1',
  name: 'James',
});

export const appDataJames = mockMultipleAppDataFactory({
  item: mockItem,
  member: james,
  creator: james,
  payloads: [
    {
      data: {
        questionId: 'id11',
        choices: ['Sydney'],
      },
      id: '1',
    },

    {
      data: {
        questionId: 'id21',
        choices: ['K'],
      },
      id: '8',
    },
    {
      data: {
        questionId: 'id31',
        value: 118,
      },
      id: '15',
    },
    {
      data: {
        questionId: 'id41',
        text: 'Vatican City',
      },
      id: '22',
    },
    {
      data: {
        questionId: 'id51',
        text: 'Roses are <red>, violets are <blue>, sugar is <sweet>.',
      },
      id: '29',
    },
    {
      data: {
        questionId: 'id61',
        choices: ['Jupiter'],
      },
      id: '111',
    },
    {
      data: {
        questionId: 'id71',
        choices: ['6'],
      },
      id: '118',
    },
    {
      data: {
        questionId: 'id91',
        text: 'Moon',
      },
      id: '1122',
    },
    {
      data: {
        questionId: 'id81',
        value: 8,
      },
      id: '1115',
    },
    {
      data: {
        questionId: 'id101',
        text: 'All roads lead to <Rome>, and every journey begins with a single <step>.',
      },
      id: '1129',
    },
  ],
});
