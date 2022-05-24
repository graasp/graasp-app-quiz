const buildDatabase = (appContext) => ({
    appData: [{
      id:'id',
      data: {
        question:'',
        choices: []
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