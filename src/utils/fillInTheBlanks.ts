import { UnionOfConst } from '@graasp/sdk';

import { FILL_BLANKS_TYPE } from '../config/constants';

export type Word = {
  id: number;
  text: string;
  type: UnionOfConst<typeof FILL_BLANKS_TYPE>;
  displayed?: string;
  placed?: boolean;
};

export type Result = {
  answers: Word[];
  words: Word[];
};

const removeMarkup = (a: string) => a.trim().slice(1, -1);

export const ANSWER_REGEXP = /<[^<>]*>/g;

export const EMPTY_BLANK_CONTENT = ' __________ ';

/**
 * Return a result containing an array of answers (words to place in blanks) and an array of words (the remaining texts that are not fillable).
 *
 * @param text The entire text with the blanks to be filled in (in <some_text> format).
 * @param response The answer is the whole text with <> for blanks, and <an_answer> where the answer has been placed. Can be null if the user hasn't fill any blanks.
 * @returns Result object containing the answers and remaining texts as arrays.
 */
export const splitSentence = (
  text: string | undefined = '',
  response?: string
) => {
  const responses = [...(response ?? '').matchAll(ANSWER_REGEXP)].map(
    ([a]) => removeMarkup(a) ?? ''
  );
  const answers = [...text.matchAll(ANSWER_REGEXP)].map(([a], idx) => ({
    id: 2 * idx + 1,
    text: removeMarkup(a),
    placed: false,
    type: FILL_BLANKS_TYPE.BLANK,
  }));

  // array of part of texts without blank
  const remainingTextParts = text.split(ANSWER_REGEXP);

  const result = remainingTextParts.reduce<Result>(
    (acc, w, idx) => {
      const word = {
        // The id is computed like that to have word as even idx and answer as odd idx.
        id: 2 * idx,
        text: w,
        type: FILL_BLANKS_TYPE.WORD,
      };
      acc.words.push(word);

      // push answer just after
      if (idx < answers.length) {
        // display saved response
        let displayed = '';
        if (idx < responses.length) {
          const value = responses[idx];
          if (value) {
            displayed = value;
          }
        }

        acc.words.push({ ...answers[idx], displayed });
        acc.answers.push(answers[idx]);
      }

      return acc;
    },
    { answers: [], words: [] }
  );

  // add remaining answers
  if (remainingTextParts.length < answers.length) {
    answers.slice(remainingTextParts.length).forEach((a) => {
      result.words.push(a);
    });
  }

  // second pass to set as placed the displayed text
  const displayedWords = result.words.map(({ displayed }) => displayed);
  result.answers = result.answers.map((a) => {
    const idx = displayedWords.findIndex((word) => word === a.text);
    const isPlaced = idx >= 0;

    // remove occurence from displayed answers
    if (isPlaced) {
      displayedWords.splice(idx, 1);
    }

    return { ...a, placed: isPlaced };
  });

  return result;
};

/**
 * Construct a string from the user's response. The answers are surrounded by <>.
 *
 * @param words All the words in the fill in the blanks text (words and answers).
 * @returns A string of the user's answer.
 */
export const responseToText = (userResponse: Word[]) =>
  userResponse
    .reduce((acc, word) => {
      const text =
        word.type === FILL_BLANKS_TYPE.BLANK
          ? `<${word.displayed}>`
          : word.text;
      return acc + ' ' + text;
    }, '')
    .trim();
