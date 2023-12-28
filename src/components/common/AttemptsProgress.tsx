import { useTranslation } from 'react-i18next';

import { Box, SxProps, Typography } from '@mui/material';

import { QUIZ_TRANSLATIONS } from '../../langs/constants';
import { StatusColor } from '../types/types';
import CircularProgressWithPath from './CircularProgressWithPath';

type Props = {
  value: number;
  maxValue: number;
  sx?: SxProps;
  color?: StatusColor;
};

export const AttemptsProgress = ({ value, maxValue, sx, color }: Props) => {
  const { t } = useTranslation();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={sx}>
      <Typography sx={{ marginBottom: 1 }}>
        {t(QUIZ_TRANSLATIONS.ATTEMPTS_PROGRESS_NUMBER_OF_ATTEMPTS)}
      </Typography>
      <CircularProgressWithPath
        value={value}
        maxValue={maxValue}
        color={color}
      />
    </Box>
  );
};

export default AttemptsProgress;
