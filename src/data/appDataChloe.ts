import { mockMemberFactory, mockMultipleAppDataFactory } from './factories';
import { mockItem } from './items';

export const chloe = mockMemberFactory({
  id: 'mock-member-id-8',
  name: 'Olivia',
});

export const appDataChloe = mockMultipleAppDataFactory({
  item: mockItem,
  member: chloe,
  creator: chloe,
  payloads: [
    {
      data: {
        questionId: 'id11',
        choices: ['Canberra'],
      },
      id: '36',
    },
    {
      data: {
        questionId: 'id21',
        choices: ['K'],
      },
      id: '39',
    },
    {
      data: {
        questionId: 'id31',
        value: 80,
      },
      id: '42',
    },
    {
      data: {
        questionId: 'id41',
        text: 'Vatican City',
      },
      id: '45',
    },
    {
      data: {
        questionId: 'id51',
        text: 'Roses are <red>, violets are <blue>, sugar is <sweet>.',
      },
      id: '48',
    },
    {
      data: {
        questionId: 'id61',
        choices: ['Mars', 'Venus'],
      },
      id: '1136',
    },
    {
      data: {
        questionId: 'id71',
        choices: ['4'],
      },
      id: '1139',
    },
    {
      data: {
        questionId: 'id81',
        value: 7,
      },
      id: '1142',
    },
    {
      data: {
        questionId: 'id91',
        text: 'Saturn',
      },
      id: '1145',
    },
    {
      data: {
        questionId: 'id101',
        text: 'All roads lead to <Rome>, and every journey begins with a single <step>.',
      },
      id: '1148',
    },
  ],
});
