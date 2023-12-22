import { Box, SxProps, Typography } from '@mui/material';

import CircularProgressWithPath from './CircularProgressWithPath';

type Props = {
  value: number;
  maxValue: number;
  sx?: SxProps;
};

export const AttemptsProgress = ({ value, maxValue, sx }: Props) => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" sx={sx}>
      {/* TODO: translate me */}
      <Typography sx={{ marginBottom: 1 }}>Number of attempts</Typography>
      <CircularProgressWithPath value={value} maxValue={maxValue} />
    </Box>
  );
};

export default AttemptsProgress;
