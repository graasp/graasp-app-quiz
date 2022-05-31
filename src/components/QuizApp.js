import React, { Component } from "react";
import { TokenProvider } from './context/TokenContext';
import { ContextProvider } from './context/ContextContext';
import Create from './Create'
import Play from './Play'
import {
  queryClient,
  QueryClientProvider,
  ReactQueryDevtools,
} from '../config/queryClient';
import { PlayArrow } from "@mui/icons-material";

export class QuizApp extends Component {
  constructor() {
    super();
  }

  render() {
    const quiz = (<div className="container">
      <div className="title">
        <Create />
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