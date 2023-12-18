import React from 'react';

import { Typography } from '@mui/material';
import { styled } from '@mui/system';

import { FILL_BLANKS_TYPE } from '../../../config/constants';
import { buildBlankedTextWordCy } from '../../../config/selectors';
import { Word } from '../../../utils/fillInTheBlanks';
import Blank from './Blank';

export const WordWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'center',
  flexWrap: 'wrap',
  rowGap: theme.spacing(1),
}));

type Props = {
  showCorrection: boolean;
  words: Word[];
  onDrop: (e: React.DragEvent<HTMLSpanElement>, id: number) => void;
  onDelete: (e: React.MouseEvent<HTMLSpanElement>) => void;
};

const BlankedText = ({ showCorrection = false, words, onDrop, onDelete }: Props) => {
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
          key={i}
          id={word.id}
          onDrop={onDrop}
          onDelete={onDelete}
          text={word.displayed ?? ' '}
        />
      );
    });
  };

  return <WordWrapper>{renderWords()}</WordWrapper>;
};

export default BlankedText;
