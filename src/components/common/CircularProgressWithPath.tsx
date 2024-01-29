import { Box, CircularProgress, Color } from '@mui/material';

import { StatusColor } from '../types/types';

type Props = {
  value: number;
  maxValue?: number;
  minPercent?: number;
  size?: number;
  thickness?: number;
  pathColor?: Color | string;
  color?: StatusColor;
  htmlColor?: string;
  showText?: boolean;
  marginLeft?: number;
};

const DEFAULT_SIZE = 17;
const DEFAULT_THICKNESS = 5;
const DEFAULT_PATH_COLOR = '#d1d1d1';
const BORDER_RADIUS = '50%';
const SHADOW_SCALLING_FACTOR = 44;
const DEFAULT_COLOR = 'primary';
const MAX_PERCENT = 100;
const DEFAULT_MIN_PERCENT = (1 / 10) * 100;

export const CircularProgressWithPath = ({
  value,
  maxValue,
  minPercent = DEFAULT_MIN_PERCENT,
  size = DEFAULT_SIZE,
  thickness = DEFAULT_THICKNESS,
  pathColor = DEFAULT_PATH_COLOR,
  color = DEFAULT_COLOR,
  htmlColor,
  marginLeft,
}: Props) => {
  const progressSx = {
    borderRadius: BORDER_RADIUS,
    color: htmlColor,
    boxShadow: `inset 0 0 0 ${
      (thickness / SHADOW_SCALLING_FACTOR) * size
    }px ${pathColor}`,
    ml: marginLeft,
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
        value={Math.max(circularValue, minPercent)}
        size={size}
        thickness={thickness}
        sx={progressSx}
        color={color}
      />
    </Box>
  );
};

export default CircularProgressWithPath;
