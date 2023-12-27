import React from 'react';

import { Box } from '@mui/material';

import { Word } from '../../../utils/fillInTheBlanks';
import Answer from './Answer';

type Props = {
  answers: Word[];
  isReadonly: boolean;
};

const Answers = ({ answers, isReadonly }: Props) => {
  const onDragStart = (e: React.DragEvent<HTMLSpanElement>, id: string) => {
    if (!isReadonly && e.dataTransfer) {
      e.dataTransfer.setData('text/plain', id);
    }
  };

  const _handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const _handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <Box
      display="flex"
      p={1}
      justifyContent="center"
      mb={3}
      borderRadius={2}
      border="1px grey dotted"
      flexWrap="wrap"
      minHeight={50}
      width={'100%'}
      onDragLeave={_handleDragLeave}
      onDragOver={_handleDragOver}
    >
      {answers
        .filter((a) => !a.placed)
        .sort(({ text: textA }, { text: textB }) =>
          textA < textB ? -1 : textA > textB ? 1 : 0
        )
        .map((a) => {
          return (
            <Answer
              onDragStart={onDragStart}
              key={a.id}
              id={a.id}
              name={a.text}
              isReadonly={isReadonly}
            />
          );
        })}
    </Box>
  );
};

export default Answers;
