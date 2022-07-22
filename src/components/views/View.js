import React, { useContext } from 'react';

import { Container } from '@mui/material';

import { Context } from '@graasp/apps-query-client';

import { PERMISSION_LEVELS } from '../../config/settings';
import { QuizProvider } from '../context/QuizContext';
import CreateView from '../create/CreateView';
import PlayView from '../play/PlayView';

const View = () => {
  const context = useContext(Context);

  const renderContent = () => {
    if (context.get('context') === 'player') {
      return <PlayView />;
    }

    switch (context.get('permission')) {
      case PERMISSION_LEVELS.ADMIN:
      case PERMISSION_LEVELS.WRITE:
      case PERMISSION_LEVELS.READ:
        return <CreateView />;

      default:
        return <PlayView />;
    }
  };

  return (
    <Container maxWidth="md">
      <QuizProvider>{renderContent()}</QuizProvider>
    </Container>
  );
};

export default View;
