import { useTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';

import { useLocalContext } from '@graasp/apps-query-client';

const PublicAlert = (): JSX.Element | null => {
  const { t } = useTranslation();

  const context = useLocalContext();

  // does not show banner if user exists
  if (context?.memberId) {
    return null;
  }

  return (
    <Alert severity="error" sx={{ marginBottom: 1 }}>
      {t('You are not authenticated. You cannot save any data')}
    </Alert>
  );
};

export default PublicAlert;
