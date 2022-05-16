import React, { Component } from "react";
import { TokenProvider } from './context/TokenContext';
import { ContextProvider } from './context/ContextContext';
import App from './App'
import {
  queryClient,
  QueryClientProvider,
  ReactQueryDevtools,
} from '../config/queryClient';


export class Quiz extends Component {
  constructor() {
    super();
  }

  render() {
    const quiz = (<div className="container">
      <div className="title">
        <App />
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