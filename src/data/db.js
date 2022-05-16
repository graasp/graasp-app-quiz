const buildDatabase = (appContext) => ({
    appData: [{
      id:'id',
      data: {
        question:'',
        answers: [],
        correctAnswers: []
      },
      type:'question'
    }],
    members: [
      {
        id: appContext.memberId,
        name: 'mock-member',
      },
    ],
  });
  
  export default buildDatabase;