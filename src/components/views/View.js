import React, { useContext, useEffect } from 'react';

import { Container } from '@mui/material';

import { Context } from '@graasp/apps-query-client';

import i18n from '../../config/i18n';
import { PERMISSION_LEVELS } from '../../config/settings';
import { QuizProvider } from '../context/QuizContext';
import CreateView from '../create/CreateView';
import PlayView from '../play/PlayView';

const View = () => {
  const context = useContext(Context);
  console.log(context?.toJS());

  useEffect(() => {
    const lang = context.get('lang');
    i18n.changeLanguage(lang ?? 'en');
  });

  const renderContent = () => {
    switch (context.get('context')) {
      case 'builder': {
        switch (context.get('permission')) {
          case PERMISSION_LEVELS.ADMIN:
          case PERMISSION_LEVELS.WRITE:
            return <CreateView />;

          case PERMISSION_LEVELS.READ:
          default:
            return <PlayView />;
        }
      }
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
