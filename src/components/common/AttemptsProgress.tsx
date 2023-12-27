import { Box, SxProps, Typography } from '@mui/material';

import { StatusColor } from '../types/types';
import CircularProgressWithPath from './CircularProgressWithPath';

type Props = {
  value: number;
  maxValue: number;
  sx?: SxProps;
  color?: StatusColor;
};

export const AttemptsProgress = ({ value, maxValue, sx, color }: Props) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={sx}>
      {/* TODO: translate me */}
      <Typography sx={{ marginBottom: 1 }}>Number of attempts</Typography>
      <CircularProgressWithPath
        value={value}
        maxValue={maxValue}
        color={color}
      />
    </Box>
  );
};

export default AttemptsProgress;
