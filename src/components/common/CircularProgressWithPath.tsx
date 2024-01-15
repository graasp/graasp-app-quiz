import { Box, CircularProgress, Color, Typography } from '@mui/material';

import {
  NUMBER_OF_ATTEMPTS_CIRCULAR_PROGRESSION_CY,
  NUMBER_OF_ATTEMPTS_CIRCULAR_PROGRESSION_TEXT_CY,
} from '../../config/selectors';
import { StatusColor } from '../types/types';

type Props = {
  value: number;
  maxValue?: number;
  size?: number;
  thickness?: number;
  pathColor?: Color | string;
  color?: StatusColor;
};

const DEFAULT_SIZE = 60;
const DEFAULT_THICKNESS = 5;
const DEFAULT_PATH_COLOR = '#d1d1d1';
const BORDER_RADIUS = '50%';
const SHADOW_SCALLING_FACTOR = 44;
const DEFAULT_COLOR = 'primary';
const MAX_PERCENT = 100;

export const CircularProgressWithPath = ({
  value,
  maxValue,
  size = DEFAULT_SIZE,
  thickness = DEFAULT_THICKNESS,
  pathColor = DEFAULT_PATH_COLOR,
  color = DEFAULT_COLOR,
}: Props) => {
  const progressSx = {
    borderRadius: BORDER_RADIUS,
    boxShadow: `inset 0 0 0 ${
      (thickness / SHADOW_SCALLING_FACTOR) * size
    }px ${pathColor}`,
  };

  const circularValue = maxValue
    ? value <= maxValue
      ? (value / maxValue) * MAX_PERCENT
      : MAX_PERCENT
    : value;

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={circularValue}
        size={size}
        thickness={thickness}
        sx={progressSx}
        color={color}
        data-cy={NUMBER_OF_ATTEMPTS_CIRCULAR_PROGRESSION_CY}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          data-cy={NUMBER_OF_ATTEMPTS_CIRCULAR_PROGRESSION_TEXT_CY}
        >
          {maxValue ? `${value}/${maxValue}` : value}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithPath;
