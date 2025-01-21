import { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { EMPTY_BLANK_CONTENT } from '../../../utils/fillInTheBlanks';
import { dataUrlTrashIcon } from './TrashIcon';

interface WordBoxProps extends TypographyProps {
  showCorrection: boolean;
  showCorrectness: boolean;
  isCorrect: boolean;
  isReadonly: boolean;
  filled: string;
}

const DEFAULT_BLANK_COLOR = 'blue';

export const WordBox = styled('span')<WordBoxProps>(
  ({
    theme,
    showCorrection,
    showCorrectness,
    isCorrect,
    isReadonly,
    filled,
  }) => {
    // text color
    // default: when the blank is filled
    // green: when correction is displayed, and the word is correct
    // red: when correction is displayed, and the word is incorrect
    let color = DEFAULT_BLANK_COLOR;
    if (showCorrection || showCorrectness) {
      color = isCorrect
        ? theme.palette.success.light
        : theme.palette.error.light;
    }

    return {
      // allow text flow, but disable block styles
      display: 'contents',
      cursor:
        !isReadonly && filled
          ? 'url(' + dataUrlTrashIcon + '), auto'
          : undefined,
      minWidth: '3em',
      padding: theme.spacing(0.5, 1, 0),
      paddingTop: filled ? 0 : theme.spacing(2),
      color,
      margin: theme.spacing(0, 1),
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
  dataCy,
  onDrop,
  onDelete,
}: Props) => {
  const _handleDrop = (e: React.DragEvent<HTMLSpanElement>) => {
    if (!isReadonly) {
      onDrop(e, id);
    }
  };

  const _handleDragOver = (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
  };

  const _handleDragLeave = (e: React.DragEvent<HTMLSpanElement>) => {
    e.preventDefault();
  };

  return (
    <WordBox
      data-cy={dataCy}
      showCorrection={showCorrection}
      showCorrectness={showCorrectness}
      filled={text}
      isCorrect={isCorrect}
      isReadonly={isReadonly}
      onDragLeave={_handleDragLeave}
      onDragOver={_handleDragOver}
      onDrop={_handleDrop}
      onClick={onDelete}
      data-id={id}
      data-correctness={isCorrect}
      data-text={text}
      data-disabled={isReadonly}
    >
      {text.length ? text : EMPTY_BLANK_CONTENT}
    </WordBox>
  );
};

export default Blank;
