import PropTypes from 'prop-types';

import React from 'react';

import { Typography } from '@mui/material';
import { styled } from '@mui/system';

import { FILL_BLANKS_TYPE } from '../../../config/constants';
import { buildBlankedTextWordCy } from '../../../config/selectors';
import Blank from './Blank';

export const WordWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  flexWrap: 'wrap',
  rowGap: theme.spacing(1),
}));

const BlankedText = ({ showCorrection, words, onDrop, onDelete }) => {
  const renderWords = () => {
    return words.map((word, i) => {
      if (word.type === FILL_BLANKS_TYPE.WORD) {
        return (
          <Typography data-cy={buildBlankedTextWordCy(word.id)}>
            {word.text}
          </Typography>
        );
      }

      return (
        <Blank
          dataCy={buildBlankedTextWordCy(word.id)}
          showCorrection={showCorrection}
          isCorrect={word.displayed === word.text}
          groupName={word.id}
          key={i}
          id={word.id}
          onDrop={onDrop}
          filled={word.filled}
          onDelete={onDelete}
          text={word.displayed ?? ' '}
        />
      );
    });
  };

  return <WordWrapper>{renderWords()}</WordWrapper>;
};

BlankedText.propTypes = {
  showCorrection: PropTypes.bool,
  onDrop: PropTypes.func.isRequired,
  words: PropTypes.array.isRequired,
};

BlankedText.defaultProps = {
  showCorrection: false,
};

export default BlankedText;
