import React, {Component} from "react";
//import "./style.css";
// import questionAPI from './questions';
import { TokenProvider } from './context/TokenContext';
import { ContextProvider } from './context/ContextContext';
import App from './app'
import {
  queryClient,
  QueryClientProvider,
  ReactQueryDevtools,
} from '../config/queryClient';



const questionAPI = ()=>{}

export class Quiz extends Component {
  constructor() {
    super();
    this.state = {
      questionBank: [],
      score: 0,
      responses: 0
    };
  }
  

  // Function to get question from ./question
  getQuestions = () => {
    // questionAPI().then(question => {
    //   this.setState({questionBank: question});
    // });
  };
  
  // Set state back to default and call function
  playAgain = () => {
    this.getQuestions();
    this.setState({score: 0, responses: 0});
  };
  
  // Function to compute scores
  computeAnswer = (answer, correctAns) => {
    if (answer === correctAns) {
      this.setState({
        score: this.state.score + 1
      });
    }
    this.setState({
      responses: this.state.responses < 5
        ? this.state.responses + 1
        : 5
    });
  };
  
  // componentDidMount function to get question
  componentDidMount() {
    this.getQuestions();
  }
  
  render() {
    const quiz = (<div className="container">
      <div className="title">
        <App> </App>
      </div>
  
    </div>)



const app = <QueryClientProvider client={queryClient}>
<ContextProvider>
<TokenProvider> {quiz}</TokenProvider>
</ContextProvider>
{process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
</QueryClientProvider>
  return app
  }
}