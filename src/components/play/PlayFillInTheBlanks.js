import clonedeep from 'lodash.clonedeep';

import React, { useEffect, useState } from 'react';

import Box from '@mui/material/Box';

import { responseToText, splitSentence } from '../../utils/fillInTheBlanks';
import Answers from './fillInTheBlanks/Answers';
import BlankedText from './fillInTheBlanks/BlankedText';
import Correction from './fillInTheBlanks/Correction';

const PlayFillInTheBlanks = ({
  showCorrection,
  setResponse,
  values,
  response,
}) => {
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

  console.log(values, response);

  useEffect(() => {
    const { words, answers } = splitSentence(values.text ?? '', response.text);
    setState({ ...state, words, answers });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, response]);

  const saveResponse = (newWords) => {
    setResponse(responseToText(newWords));
  };

  const onDelete = (e) => {
    const clickedId = +e.target.dataset.id;
    // remove from text
    const newWords = clonedeep(state.words);
    const toDelete = newWords.find(({ id }) => id === clickedId);
    toDelete.displayed = '';

    saveResponse(newWords);
  };

  const onDrop = (e, dropId) => {
    const text = e.dataTransfer.getData('text/plain');
    let previousAnswer = null;

    // update words to display dropped answer
    const newWords = clonedeep(state.words);
    const blank = newWords.find((word) => word.id === dropId);
    // change reference
    blank.displayed = text;

    // remove answer
    const newAnswers = clonedeep(state.answers);
    const droppedAnswer = newAnswers.find((answer) => answer.text === text);
    // change reference
    droppedAnswer.placed = true;

    // add back the previous answer to the poll
    if (previousAnswer) {
      const prevAnswer = newAnswers.find(
        (answer) => answer.text === previousAnswer
      );
      // change reference
      prevAnswer.placed = false;
    }

    saveResponse(newWords);
  };

  return (
    <Box width="100%">
      <Answers answers={state.answers} />
      <BlankedText
        onDelete={onDelete}
        showCorrection={showCorrection}
        onDrop={onDrop}
        words={state.words}
        responses={state.responses}
      />
      {showCorrection && <Correction words={state.words} />}
    </Box>
  );
};

export default PlayFillInTheBlanks;
