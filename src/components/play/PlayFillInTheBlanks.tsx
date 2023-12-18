import clonedeep from 'lodash.clonedeep';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';

import {
  Word,
  responseToText,
  splitSentence,
} from '../../utils/fillInTheBlanks';
import {
  FillTheBlanksAppDataData,
  FillTheBlanksAppSettingData,
} from '../types/types';
import Answers from './fillInTheBlanks/Answers';
import BlankedText from './fillInTheBlanks/BlankedText';
import Correction from './fillInTheBlanks/Correction';

type Props = {
  showCorrection: boolean;
  values: FillTheBlanksAppSettingData;
  response: FillTheBlanksAppDataData;
  setResponse: (text: string) => void;
};

const PlayFillInTheBlanks = ({
  showCorrection,
  values,
  response,
  setResponse,
}: Props) => {
  const [state, setState] = useState(
    (() => {
      const { words, answers } = splitSentence(
        values.text ?? '',
        response.text
      );
      return {
        answers,
        words,
      };
    })()
  );

  useEffect(() => {
    const { words, answers } = splitSentence(values.text ?? '', response.text);
    setState({ ...state, words, answers });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, response]);

  const saveResponse = (newWords: Word[]) => {
    setResponse(responseToText(newWords));
  };

  const onDelete = (e: React.MouseEvent<HTMLSpanElement>) => {
    const datasetId = e.currentTarget.dataset.id;
    // TODO: check what to do if is null.
    if (datasetId) {
      const clickedId = +datasetId;
      // remove from text
      const newWords = clonedeep(state.words);
      const toDelete = newWords.find(({ id }) => id === clickedId);
      if (toDelete) {
        toDelete.displayed = '';
      }
      saveResponse(newWords);
    } else {
      console.error('The dataset id is null');
    }
  };

  const onDrop = (e: React.DragEvent<HTMLSpanElement>, dropId: number) => {
    const text = e.dataTransfer.getData('text/plain');
    const previousAnswer = null;

    // update words to display dropped answer
    const newWords = clonedeep(state.words);
    const blank = newWords.find((word) => word.id === dropId);
    if (blank) {
      // change reference
      blank.displayed = text;
    }
    // remove answer
    const newAnswers = clonedeep(state.answers);
    const droppedAnswer = newAnswers.find((answer) => answer.text === text);
    if (droppedAnswer) {
      // change reference
      droppedAnswer.placed = true;
    }
    // add back the previous answer to the poll
    if (previousAnswer) {
      const prevAnswer = newAnswers.find(
        (answer) => answer.text === previousAnswer
      );
      if (prevAnswer) {
        // change reference
        prevAnswer.placed = false;
      }
    }

    saveResponse(newWords);
  };

  return (
    <Box width="100%">
      <Answers answers={state.answers} />
      <BlankedText
        showCorrection={showCorrection}
        words={state.words}
        onDrop={onDrop}
        onDelete={onDelete}
      />
      {showCorrection && <Correction words={state.words} />}
    </Box>
  );
};

export default PlayFillInTheBlanks;
