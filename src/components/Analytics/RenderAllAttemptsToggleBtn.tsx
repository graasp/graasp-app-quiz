import { t } from 'i18next';

import { Box, FormControlLabel, FormGroup, Switch } from '@mui/material';

import { QUIZ_TRANSLATIONS } from '../../langs/constants';

type Props = {
  considerLastAttemptsOnly: boolean;
  onChange: (checked: boolean) => void;
};

export const RenderAllAttemptsToggleBtn = ({
  considerLastAttemptsOnly,
  onChange,
}: Props) => (
  <Box
    width="100%"
    display="flex"
    flexDirection="row"
    justifyContent={{ xs: 'start', sm: 'end' }}
  >
    <FormGroup>
      <FormControlLabel
        control={
          <Switch
            checked={considerLastAttemptsOnly}
            onChange={(_, checked: boolean) => onChange(checked)}
          />
        }
        label={t(QUIZ_TRANSLATIONS.ANALYTICS_CONSIDER_LAST_ATTEMPTS_TOGGLE)}
      />
    </FormGroup>
  </Box>
);

export default RenderAllAttemptsToggleBtn;
