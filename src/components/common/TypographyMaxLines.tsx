import { ReactNode } from 'react';

import { Typography, TypographyProps } from '@mui/material';

type Props = TypographyProps & {
  maxLines: number;
  children?: ReactNode;
};

export const TypographyMaxLines = ({
  maxLines,
  children,
  ...typographyProps
}: Props) => {
  return (
    <Typography
      {...typographyProps}
      sx={{
        ...typographyProps.sx, 
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: maxLines,
      }}
    >
      {children}
    </Typography>
  );
};

export default TypographyMaxLines;
