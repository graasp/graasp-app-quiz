import { useMemo } from 'react';

import { TextField, Typography } from '@mui/material';

type Props = {
  title: string;
  subTitle: string;
  label: string;
  value?: string;
  dataCy: string;
  onChange: (s: string) => void;
};

const TitleDescriptionTextField = ({
  title,
  subTitle,
  label,
  value,
  dataCy,
  onChange,
}: Props) => {
  const textFieldValue = useMemo(() => value ?? '', [value]);

  return (
    <>
      <Typography variant="h6">{title}</Typography>
      {
        <Typography variant="body1" mb={1}>
          {subTitle}
        </Typography>
      }
      <TextField
        data-cy={dataCy}
        fullWidth
        value={textFieldValue}
        label={label}
        variant="outlined"
        onChange={(t) => onChange(t.target.value)}
        multiline
      />
    </>
  );
};

export default TitleDescriptionTextField;
