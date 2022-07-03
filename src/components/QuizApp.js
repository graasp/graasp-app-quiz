import React, { Component, useContext } from "react";
import { TokenProvider } from "./context/TokenContext";
import { ContextProvider } from "./context/ContextContext";
import Create from "./Create";
import Play from "./Play";
import { Context } from "./context/ContextContext";
import { PERMISSION_LEVELS } from "./config/settings";
import {
  queryClient,
  QueryClientProvider,
  ReactQueryDevtools,
} from "../config/queryClient";
import { PlayArrow } from "@mui/icons-material";
import View from "./View";

export const QuizApp = () => {
  const quiz = (
    <div className="container">
      <div className="title">
        {/* {() => {
            switch (context.get('permission')) {
              case PERMISSION_LEVELS.ADMIN:
              case PERMISSION_LEVELS.WRITE:
                return <Create />;
          
              case PERMISSION_LEVELS.READ:
              default:
                return <Play />;
            }
          }}() */}
        <Play />
      </div>
    </div>
  );

  const app = (
    <QueryClientProvider client={queryClient}>
      <ContextProvider>
        <TokenProvider> {quiz}</TokenProvider>
      </ContextProvider>
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
  return app;
};
