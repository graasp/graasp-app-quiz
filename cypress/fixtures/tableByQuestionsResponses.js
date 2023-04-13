/**
 * Array containing the expected data for each table in the table by question page
 */
export const RESPONSES = {
  // Data first question
  'Fill In The Blanks': [
    {
      userId: 'mock-member-id-1',
      fields: {
        answer:
          'Lorem <ipsum> dolor sit amet, consectetur adipiscing elit. <ips um> ut fermentum nulla, sed <suscipit> sem.',
        date: 'Fri Jul 22 2022',
        icon: 'CancelOutlinedIcon',
      },
    },
    {
      userId: 'mock-member-id-2',
      fields: {
        answer: 'Not yet answered',
      },
    },
    {
      userId: 'mock-member-id-3',
      fields: {
        answer:
          'Lorem <suscipti> dolor sit amet, consectetur adipiscing elit. <Praesent> ut fermentum nulla, sed <ip sum> sem.',
        date: 'Fri Jul 22 2022',
        icon: 'CancelOutlinedIcon',
      },
    },
  ],
  // Data second question
  'How happy are you?': [
    {
      userId: 'mock-member-id-1',
      fields: {
        answer: 'Not yet answered',
      },
    },
    {
      userId: 'mock-member-id-2',
      fields: {
        answer: '60',
        date: 'Fri Jul 22 2022',
        icon: 'CancelOutlinedIcon',
      },
    },
    {
      userId: 'mock-member-id-3',
      fields: {
        answer: 'Not yet answered',
      },
    },
  ],
  // Data third question
  'What is a baby cat called?': [
    {
      userId: 'mock-member-id-1',
      fields: {
        answer: '90',
        date: 'Fri Jul 22 2022',
        icon: 'CancelOutlinedIcon',
      },
    },
    {
      userId: 'mock-member-id-2',
      fields: {
        answer: 'Not yet answered',
      },
    },
    {
      userId: 'mock-member-id-3',
      fields: {
        answer: 'Not yet answered',
      },
    },
  ],
  // Data fourth question
  'What is the capital of France?': [
    {
      userId: 'mock-member-id-1',
      fields: {
        answer: 'Paris',
        date: 'Fri Jul 22 2022',
        icon: 'CheckCircleOutlinedIcon',
      },
    },
    {
      userId: 'mock-member-id-2',
      fields: {
        answer: 'Tokyo, London',
        date: 'Fri Jul 22 2022',
        icon: 'CancelOutlinedIcon',
      },
    },
    {
      userId: 'mock-member-id-3',
      fields: {
        answer: 'Not yet answered',
      },
    },
  ],
};
