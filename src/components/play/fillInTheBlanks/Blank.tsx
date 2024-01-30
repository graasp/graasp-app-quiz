import React, { useState } from 'react';

import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface WordBoxProps extends TypographyProps {
  backgroundColor?: string;
  showCorrection: boolean;
  showCorrectness: boolean;
  isCorrect: boolean;
  isReadonly: boolean;
  hasChanged: boolean;
  filled: string;
}

export const WordBox = styled(Typography)<WordBoxProps>(
  ({
    theme,
    backgroundColor,
    showCorrection,
    showCorrectness,
    isCorrect,
    isReadonly,
    hasChanged,
    filled,
  }) => {
    let bgColor = backgroundColor ?? 'transparent';
    if (!hasChanged) {
      if (showCorrection || showCorrectness) {
        bgColor = isCorrect
          ? theme.palette.success.main
          : theme.palette.error.main;
      } else {
        bgColor = theme.palette.warning.main;
      }
    }

    return {
      cursor: isReadonly ? '' : 'pointer',
      minWidth: '3em',
      padding: theme.spacing(0.5, 1, 0),
      paddingTop: filled ? 0 : theme.spacing(2),
      borderRadius: showCorrection ? '5px' : 0,
      margin: theme.spacing(0, 1),
      borderBottom: showCorrection ? 'none' : '1px solid black',
      backgroundColor: bgColor,

      '&:hover': {
        textDecoration: isReadonly ? '' : 'line-through',
      },
    };
  }
);

type Props = {
  id: number;
  text: string;
  isCorrect: boolean;
  showCorrection: boolean;
  showCorrectness: boolean;
  isReadonly: boolean;
  hasChanged: boolean;
  dataCy: string;
  onDrop: (e: React.DragEvent<HTMLSpanElement>, id: number) => void;
  onDelete: (e: React.MouseEvent<HTMLSpanElement>) => void;
};

const Blank = ({
  id,
  text,
  isCorrect,
  showCorrection,
  showCorrectness,
  isReadonly,
  hasChanged,
  dataCy,
  onDrop,
  onDelete,
}: Props) => {
  const [state, setState] = useState({
    backgroundColor: 'white',
  });

  const _handleDrop = (e: React.DragEvent<HTMLSpanElement>) => {
    if (!isReadonly) {
      onDrop(e, id);
      setState({ backgroundColor: 'transparent' });
    }
  };

  const _handleDragOver = (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (!isReadonly) {
      setState({ backgroundColor: 'yellow' });
    }
  };

  const _handleDragLeave = (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
    if (!isReadonly) {
      setState({ backgroundColor: 'transparent' });
    }
  };

  return (
    <WordBox
      data-cy={dataCy}
      showCorrection={showCorrection}
      showCorrectness={showCorrectness}
      filled={text}
      isCorrect={isCorrect}
      isReadonly={isReadonly}
      hasChanged={hasChanged}
      backgroundColor={state.backgroundColor}
      onDragLeave={_handleDragLeave}
      onDragOver={_handleDragOver}
      onDrop={_handleDrop}
      onClick={onDelete}
      data-id={id}
      data-correctness={isCorrect}
      data-text={text}
      data-disabled={isReadonly}
    >
      {text}
    </WordBox>
  );
};

export default Blank;
