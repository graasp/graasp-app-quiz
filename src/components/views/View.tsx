import { useEffect } from 'react';

import { Container } from '@mui/material';

import { useLocalContext } from '@graasp/apps-query-client';
import { Context, PermissionLevel } from '@graasp/sdk';

import { DEFAULT_LANG } from '../../config/constants';
import i18n from '../../config/i18n';
import { QuizProvider } from '../context/QuizContext';
import AdminView from '../navigation/AdminView';
import PlayView from '../play/PlayView';
import PublicAlert from './PublicAlert';

const View = (): JSX.Element => {
  const context = useLocalContext();

  useEffect(() => {
    const lang = context.get('lang');
    i18n.changeLanguage(lang ?? DEFAULT_LANG);
  });
  const renderContent = () => {
    switch (context.get('context')) {
      case Context.Builder: {
        switch (context.get('permission')) {
          case PermissionLevel.Admin:
          case PermissionLevel.Write:
            return <AdminView />;
          case PermissionLevel.Read:
          default:
            return <PlayView />;
        }
      }
      default:
        return <AdminView />;
    }
  };

  return (
    <Container maxWidth="md">
      <PublicAlert />
      <QuizProvider>{renderContent()}</QuizProvider>
    </Container>
  );
};

export default View;
