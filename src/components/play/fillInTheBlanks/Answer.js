import PropTypes from 'prop-types';

import React from 'react';

import { Typography, styled } from '@mui/material';

import { buildFillBlanksAnswerId } from '../../../config/selectors';

export const Wrapper = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(1),
  cursor: 'pointer',
  minWidth: '1em',
  borderBottom: '1px solid black',
}));

const Answer = ({ id, name, onDragStart }) => {
  const _handleDragStart = (e) => {
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

Answer.propTypes = {
  name: PropTypes.string.isRequired,
  onDragStart: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};

export default Answer;
