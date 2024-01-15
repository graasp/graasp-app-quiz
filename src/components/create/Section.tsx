import { Stack, SxProps, Typography } from '@mui/material';

type Props = {
  title: string;
  explanation: string;
  children: JSX.Element[] | JSX.Element;
  sx?: SxProps;
};

export const Section = ({ children, title, explanation, sx }: Props) => {
  return (
    <Stack sx={sx}>
      <Typography variant="h6">{title}</Typography>

      <Typography variant="body1" mb={1}>
        {explanation}
      </Typography>

      {children}
    </Stack>
  );
};

export default Section;
