// import { Database, LocalContext } from '@graasp/apps-query-client';
// import { PermissionLevel } from '@graasp/sdk';

// import { API_HOST, APP_SETTING_NAMES, QuestionType } from '../config/constants';
// import {
//   mockAppDataFactory,
//   mockAppSettingFactory,
//   mockItemFactory,
//   mockMemberFactory,
// } from './factories';

// export const mockMembers = [
//   mockMemberFactory({
//     id: '0f0a2774-a965-4b97-afb4-bccc3796e060',
//     name: 'anna',
//   }),
//   mockMemberFactory({
//     id: 'mock-member-id-0',
//     name: 'George',
//   }),
//   mockMemberFactory({
//     id: 'mock-member-id-1',
//     name: 'James',
//   }),
//   mockMemberFactory({
//     id: 'mock-member-id-2',
//     name: 'Sarah',
//   }),
//   mockMemberFactory({
//     id: 'mock-member-id-3',
//     name: 'Emily',
//   }),
// ];

// export const mockCurrentMember = mockMembers[0];

// export const mockItem = mockItemFactory('1234-1234-123456-8123-123456');

// export const mockContext: LocalContext = {
//   apiHost: API_HOST,
//   permission: PermissionLevel.Admin,
//   context: 'builder',
//   itemId: mockItem.id,
//   memberId: mockCurrentMember.id,
// };

// const buildDatabase = (): Database => ({
//   appData: [
//     mockAppDataFactory({
//       id: '2',
//       item: mockItem,
//       member: mockCurrentMember,
//       creator: mockCurrentMember,
//       data: {
//         questionId: 'id41',
//         choices: ['Paris'],
//       },
//     }),
//     mockAppDataFactory({
//       id: '3',
//       item: mockItem,
//       member: mockCurrentMember,
//       creator: mockCurrentMember,
//       data: {
//         questionId: 'id61',
//         text: '90',
//       },
//     }),
//     mockAppDataFactory({
//       id: '4',
//       item: mockItem,
//       member: mockCurrentMember,
//       creator: mockCurrentMember,
//       data: {
//         questionId: 'id71',
//         text: 'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
//       },
//     }),
//     mockAppDataFactory({
//       id: '5',
//       item: mockItem,
//       member: mockMembers[3],
//       creator: mockMembers[3],
//       data: {
//         questionId: 'id51',
//         value: 60,
//       },
//     }),
//     mockAppDataFactory({
//       id: '6',
//       item: mockItem,
//       member: mockMembers[3],
//       creator: mockMembers[3],
//       data: {
//         questionId: 'id41',
//         choices: ['Tokyo', 'London'],
//       },
//     }),
//     mockAppDataFactory({
//       id: '7',
//       item: mockItem,
//       member: mockMembers[3],
//       creator: mockMembers[3],
//       data: {
//         questionId: 'id61',
//         text: 'kitten',
//       },
//     }),
//     mockAppDataFactory({
//       id: '8',
//       item: mockItem,
//       member: mockMembers[3],
//       creator: mockMembers[3],
//       data: {
//         questionId: 'id71',
//         text: 'Lorem <ips um> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
//       },
//     }),
//     mockAppDataFactory({
//       id: '9',
//       item: mockItem,
//       member: mockMembers[4],
//       creator: mockMembers[4],
//       data: {
//         questionId: 'id71',
//         text: 'Lorem <suscipti> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <ip sum> sem.',
//       },
//     }),
//     mockAppDataFactory({
//       id: '10',
//       item: mockItem,
//       member: mockMembers[4],
//       creator: mockMembers[4],
//       data: {
//         questionId: 'id61',
//         text: 'bird',
//       },
//     }),
//   ],
//   appSettings: [
//     mockAppSettingFactory({
//       id: 'question-list',
//       item: mockItem,
//       data: {
//         list: ['id71', 'id51', 'id61', 'id41'],
//       },
//       name: APP_SETTING_NAMES.QUESTION_LIST,
//     }),
//     mockAppSettingFactory({
//       id: 'id4',
//       item: mockItem,
//       data: {
//         questionId: 'id41',
//         question: 'What is the capital of France?',
//         type: QuestionType.MULTIPLE_CHOICES,
//         choices: [
//           {
//             value: 'London',
//             isCorrect: false,
//             explanation: 'London is the capital of England',
//           },
//           {
//             value: 'Paris',
//             isCorrect: true,
//             explanation: 'Paris is the capital of France',
//           },
//           {
//             value: 'New York',
//             isCorrect: false,
//             explanation: 'New York is not located in France',
//           },
//           {
//             value: 'Tokyo',
//             isCorrect: false,
//             explanation: 'Tokyo is the capital of Japan',
//           },
//         ],
//         explanation: 'Paris is the capital of France.',
//       },
//       name: APP_SETTING_NAMES.QUESTION,
//     }),
//     mockAppSettingFactory({
//       id: 'id5',
//       item: mockItem,
//       data: {
//         questionId: 'id51',
//         question: 'How happy are you?',
//         type: QuestionType.SLIDER,
//         min: 10,
//         max: 90,
//         value: 20,
//         explanation: 'Go to sleep.',
//       },
//       name: APP_SETTING_NAMES.QUESTION,
//     }),
//     mockAppSettingFactory({
//       id: 'id6',
//       item: mockItem,
//       data: {
//         questionId: 'id61',
//         question: 'What is a baby cat called?',
//         type: QuestionType.TEXT_INPUT,
//         text: 'kitten',
//       },
//       name: APP_SETTING_NAMES.QUESTION,
//     }),
//     mockAppSettingFactory({
//       id: 'id7',
//       item: mockItem,
//       data: {
//         questionId: 'id71',
//         question: 'Fill In The Blanks',

//         type: QuestionType.FILL_BLANKS,
//         text: 'Lorem <ips um> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <suscipit> sem.',
//       },
//       name: APP_SETTING_NAMES.QUESTION,
//     }),
//   ],
//   members: mockMembers,
//   appActions: [],
//   items: [mockItem],
// });

// export default buildDatabase;
