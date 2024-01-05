import { mockItem } from './items';
import { mockMemberFactory, mockMultipleAppDataFactory } from './factories';

export const olivia = mockMemberFactory({
  id: 'mock-member-id-7',
  name: 'Olivia',
});

export const appDataOlivia = mockMultipleAppDataFactory({
  item: mockItem,
  member: olivia,
  creator: olivia,
  payloads: [
    {
      data: {
        questionId: 'id11',
        choices: ['Sydney', 'Melbourne', 'Brisbane'],
      },
      id: '7',
    },
    {
      data: {
        questionId: 'id21',
        choices: ['K'],
      },
      id: '14',
    },
    {
      data: {
        questionId: 'id61',
        choices: ['Jupiter', 'Venus'],
      },
      id: '117',
    },
    {
      data: {
        questionId: 'id71',
        choices: ['5'],
      },
      id: '1114',
    },
    {
      data: {
        questionId: 'id81',
        value: 8,
      },
      id: '1121',
    },
    {
      data: {
        questionId: 'id101',
        text: 'All roads lead to <step>, and every journey begins with a single <Rome>.',
      },
      id: '1135',
    },
  ],
});
