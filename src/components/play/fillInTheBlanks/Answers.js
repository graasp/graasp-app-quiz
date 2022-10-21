import React from 'react';

import { Box } from '@mui/material';

import Answer from './Answer';

const Answers = ({ answers }) => {
  const onDragStart = (e, id) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', id);
    }
  };

  const _handleDragOver = (e) => {
    e.preventDefault();
  };

  const _handleDragLeave = (e) => {
    e.preventDefault();
  };

  return (
    <Box
      display="flex"
      p={1}
      justifyContent="center"
      mb={3}
      sx={{
        borderRadius: '10px',
        border: '1px grey dotted',
        flexWrap: 'wrap',
        minHeight: '50px',
        width: '100%',
      }}
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
            />
          );
        })}
    </Box>
  );
};

export default Answers;
