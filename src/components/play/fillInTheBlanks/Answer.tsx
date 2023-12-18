import React from 'react';

import { Typography, styled } from '@mui/material';

import { buildFillBlanksAnswerId } from '../../../config/selectors';

export const Wrapper = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(1),
  cursor: 'pointer',
  minWidth: '1em',
  borderBottom: '1px solid black',
}));

type Props = {
  id: number;
  name: string;
  onDragStart: (e: React.DragEvent<HTMLSpanElement>, name: string) => void;
};

const Answer = ({ id, name, onDragStart }: Props) => {
  const _handleDragStart = (e: React.DragEvent<HTMLSpanElement>) => {
    onDragStart(e, name);
  };

  return (
    <Wrapper
      data-cy={buildFillBlanksAnswerId(id)}
      draggable
      onDragStart={_handleDragStart}
    >
      {name}
    </Wrapper>
  );
};

export default Answer;
