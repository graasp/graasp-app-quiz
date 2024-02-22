import { mockMemberFactory, mockMultipleAppDataFactory } from './factories';
import { mockItem } from './items';

export const jessica = mockMemberFactory({
  id: 'mock-member-id-5',
  name: 'Jessica',
});

export const appDataJessica = mockMultipleAppDataFactory({
  item: mockItem,
  member: jessica,
  creator: jessica,
  payloads: [
    {
      data: {
        questionId: 'id11',
        choices: ['Sydney', 'Melbourne'],
      },
      id: '5',
    },
    {
      data: {
        questionId: 'id21',
        choices: ['K'],
      },
      id: '12',
    },
    {
      data: {
        questionId: 'id41',
        text: 'Holy See',
      },
      id: '26',
    },
    {
      data: {
        questionId: 'id51',
        text: 'Roses are <blue>, violets are <red>, sugar is <sweet>.',
      },
      id: '33',
    },
    {
      data: {
        questionId: 'id91',
        text: 'Moon',
      },
      id: '1126',
    },
    {
      data: {
        questionId: 'id101',
        text: 'All roads lead to <Rome>, and every journey begins with a single <step>.',
      },
      id: '1133',
    },
  ],
});
