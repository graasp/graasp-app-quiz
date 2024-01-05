import React, { useState } from 'react';

import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

interface WordBoxProps extends TypographyProps {
  backgroundColor?: string;
  showCorrection: boolean;
  isCorrect: boolean;
  filled: string;
}

export const WordBox = styled(Typography)<WordBoxProps>(
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

type Props = {
  id: number;
  text: string;
  isCorrect: boolean;
  showCorrection: boolean;
  dataCy: string;
  onDrop: (e: React.DragEvent<HTMLSpanElement>, id: number) => void;
  onDelete: (e: React.MouseEvent<HTMLSpanElement>) => void;
};

const Blank = ({
  id,
  text,
  isCorrect,
  showCorrection,
  dataCy,
  onDrop,
  onDelete,
}: Props) => {
  const [state, setState] = useState({
    backgroundColor: 'white',
  });

  const _handleDrop = (e: React.DragEvent<HTMLSpanElement>) => {
    onDrop(e, id);
    setState({ backgroundColor: 'transparent' });
  };

  const _handleDragOver = (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
    setState({ backgroundColor: 'yellow' });
  };

  const _handleDragLeave = (e: React.DragEvent<HTMLSpanElement>) => {
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

export default Blank;
