import React, { useContext, useEffect } from 'react';

import { Container } from '@mui/material';

import { Context } from '@graasp/apps-query-client';

import { DEFAULT_LANG } from '../../config/constants';
import { PERMISSION_LEVELS } from '../../config/constants';
import { CONTEXTS } from '../../config/contexts';
import i18n from '../../config/i18n';
import { QuizProvider } from '../context/QuizContext';
import AdminView from '../navigation/AdminView';
import PlayView from '../play/PlayView';

const View = () => {
  const context = useContext(Context);

  useEffect(() => {
    const lang = context.get('lang');
    i18n.changeLanguage(lang ?? DEFAULT_LANG);
  });

  const renderContent = () => {
    switch (context.get('context')) {
      case CONTEXTS.BUILDER: {
        switch (context.get('permission')) {
          case PERMISSION_LEVELS.ADMIN:
          case PERMISSION_LEVELS.WRITE:
            return <AdminView />;
          case PERMISSION_LEVELS.READ:
          default:
            return <PlayView />;
        }
      }
      default:
        // TODO revert before PR
        //return <PlayView />;
        return <AdminView />;
    }
  };

  return (
    <Container maxWidth="md">
      <QuizProvider>{renderContent()}</QuizProvider>
    </Container>
  );
};

export default View;
