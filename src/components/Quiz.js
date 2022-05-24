import React, { Component } from "react";
import { TokenProvider } from './context/TokenContext';
import { ContextProvider } from './context/ContextContext';
import App from './App'
import Play from './Play'
import {
  queryClient,
  QueryClientProvider,
  ReactQueryDevtools,
} from '../config/queryClient';
import { PlayArrow } from "@mui/icons-material";



const questionAPI = () => { }

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
  };

  // Set state back to default and call function
  playAgain = () => {
    this.getQuestions();
    this.setState({ score: 0, responses: 0 });
  };

  // componentDidMount function to get question
  componentDidMount() {
    this.getQuestions();
  }

  render() {
    const quiz = (<div className="container">
      <div className="title">
        <Play />
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