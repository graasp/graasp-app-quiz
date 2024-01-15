import React from 'react';

import { Typography, styled } from '@mui/material';

import { buildFillBlanksAnswerId } from '../../../config/selectors';

interface WrapperProps {
  isReadonly?: boolean;
}

export const Wrapper = styled(Typography)<WrapperProps>(
  ({ theme, isReadonly = false }) => ({
    margin: theme.spacing(1),
    cursor: isReadonly ? '' : 'pointer',
    minWidth: '1em',
    borderBottom: '1px solid black',
  })
);

type Props = {
  id: number;
  name: string;
  isReadonly: boolean;
  onDragStart: (e: React.DragEvent<HTMLSpanElement>, name: string) => void;
};

const Answer = ({ id, name, isReadonly, onDragStart }: Props) => {
  const _handleDragStart = (e: React.DragEvent<HTMLSpanElement>) => {
    if (!isReadonly) {
      onDragStart(e, name);
    }
  };

  return (
    <Wrapper
      data-cy={buildFillBlanksAnswerId(id)}
      draggable={!isReadonly}
      onDragStart={_handleDragStart}
      isReadonly={isReadonly}
      data-disabled={isReadonly}
    >
      {name}
    </Wrapper>
  );
};

export default Answer;
