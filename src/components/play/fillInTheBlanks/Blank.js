import PropTypes from 'prop-types';

import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

export const WordBox = styled(Typography)(
  ({ theme, backgroundColor, showCorrection, isCorrect, filled }) => {
    let bgColor = backgroundColor ?? 'transparent';
    if (showCorrection) {
      bgColor = isCorrect
        ? theme.palette.success.main
        : theme.palette.error.main;
    }

    return {
      cursor: 'pointer',
      minWidth: '3em',
      padding: theme.spacing(0.5, 1, 0),
      paddingTop: filled ? 0 : theme.spacing(2),
      borderRadius: showCorrection ? '5px' : 0,
      margin: theme.spacing(0, 1),
      borderBottom: showCorrection ? 'none' : '1px solid black',
      backgroundColor: bgColor,

      '&:hover': {
        textDecoration: 'line-through',
      },
    };
  }
);

const Blank = ({
  showCorrection,
  onDrop,
  dataCy,
  isCorrect,
  text,
  onDelete,
  id,
}) => {
  const [state, setState] = useState({
    backgroundColor: 'white',
  });

  const _handleDrop = (e) => {
    onDrop(e, id);
    setState({ backgroundColor: 'transparent' });
  };

  const _handleDragOver = (e) => {
    e.preventDefault();
    setState({ backgroundColor: 'yellow' });
  };

  const _handleDragLeave = (e) => {
    e.preventDefault();
    setState({ backgroundColor: 'transparent' });
  };

  return (
    <WordBox
      data-cy={dataCy}
      showCorrection={showCorrection}
      filled={text}
      isCorrect={isCorrect}
      backgroundColor={state.backgroundColor}
      onDragLeave={_handleDragLeave}
      onDragOver={_handleDragOver}
      onDrop={_handleDrop}
      onClick={onDelete}
      data-id={id}
      data-correctness={isCorrect}
      data-text={text}
    >
      {text}
    </WordBox>
  );
};

Blank.propTypes = {
  bgcolor: PropTypes.string,
  children: PropTypes.string.isRequired,
  groupName: PropTypes.number.isRequired,
  ndx: PropTypes.number.isRequired,
  onDrop: PropTypes.func.isRequired,
};

export default Blank;
