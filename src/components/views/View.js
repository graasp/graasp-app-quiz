import React, { useContext } from 'react';

import { Context } from '@graasp/apps-query-client';

import { PERMISSION_LEVELS } from '../../config/settings';
import { QuizProvider } from '../context/QuizContext';
import CreateView from '../create/CreateView';
import PlayView from '../play/PlayView';

const View = () => {
  const context = useContext(Context);

  const renderContent = () => {
    switch (context.get('permission')) {
      case PERMISSION_LEVELS.ADMIN:
      case PERMISSION_LEVELS.WRITE:
        return <CreateView />;

      case PERMISSION_LEVELS.READ:
      default:
        return <PlayView />;
    }
  };

  return <QuizProvider>{renderContent()}</QuizProvider>;
};

export default View;
