import { Box, CircularProgress, Color, Typography } from '@mui/material';

type Props = {
  value: number;
  maxValue?: number;
  size?: number;
  thickness?: number;
  pathColor?: Color | string;
};

const DEFAULT_SIZE = 60;
const DEFAULT_THICKNESS = 5;
const DEFAULT_PATH_COLOR = '#d1d1d1';
const BORDER_RADIUS = '50%';
const SHADOW_SCALLING_FACTOR = 44;

export const CircularProgressWithPath = ({
  value,
  maxValue,
  size = DEFAULT_SIZE,
  thickness = DEFAULT_THICKNESS,
  pathColor = DEFAULT_PATH_COLOR,
}: Props) => {
  const progressSx = {
    borderRadius: BORDER_RADIUS,
    boxShadow: `inset 0 0 0 ${
      (thickness / SHADOW_SCALLING_FACTOR) * size
    }px ${pathColor}`,
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress
        variant="determinate"
        value={maxValue ? (value / maxValue) * 100 : value}
        size={size}
        thickness={thickness}
        sx={progressSx}
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
        <Typography variant="caption" component="div" color="text.secondary">
          {maxValue ? `${value}/${maxValue}` : value}
        </Typography>
      </Box>
    </Box>
  );
};

export default CircularProgressWithPath;
