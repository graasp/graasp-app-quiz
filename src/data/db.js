const buildDatabase = (appContext) => ({
    appData: [{
      id:'id',
      data: {
        question:'What is the capital of France?',
        choices: [{choice: "London", isCorrect: false}, {choice: "Paris", isCorrect: true}, {choice: "New York", isCorrect: false}, {choice: "Tokyo", isCorrect: false}]
      },
      type:'question'
    }, {
      id:'id2',
      //memberId: '',
      data: {
        answers: []
      },
      type:'answer'
    }],
    members: [
      {
        id: appContext.memberId,
        name: 'mock-member',
      },
    ],
  });
  
  export default buildDatabase;