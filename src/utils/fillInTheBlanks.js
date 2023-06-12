import { FILL_BLANKS_TYPE } from '../config/constants';

const removeMarkup = (a) => a.trim().slice(1, -1);

export const ANSWER_REGEXP = /<[^<>]*>/g;

export const splitSentence = (text = '', response) => {
  const responses = [...(response ?? '').matchAll(ANSWER_REGEXP)].map(
    ([a]) => removeMarkup(a) ?? ''
  );
  const answers = [...text.matchAll(ANSWER_REGEXP)].map(([a]) => ({
    text: removeMarkup(a),
    placed: false,
  }));

  const words = text.split(ANSWER_REGEXP);

  const result = words.reduce(
    (acc, w, idx) => {
      acc.words.push({
        id: 2 * idx,
        text: w.trim(),
        type: FILL_BLANKS_TYPE.WORD,
      });

      // push answer just after
      if (answers.length > idx) {
        // display saved response
        let displayed = '';
        if (responses.length > idx) {
          const value = responses[idx];
          if (value) {
            displayed = value;
          }
        }

        const answer = {
          ...answers[idx],
          id: 2 * idx + 1,
          type: FILL_BLANKS_TYPE.BLANK,
        };
        acc.words.push({ ...answer, displayed });
        acc.answers.push(answer);
      }

      return acc;
    },
    { answers: [], words: [] }
  );

  // add remaining answers
  if (words.length < answers.length) {
    answers.slice(words.length).forEach((a) => {
      result.words.push(a);
    });
  }

  // second pass to set as placed the displayed text
  result.answers = result.answers.map((a) => {
    const isPlaced = result.words.find((word) => {
      return word.displayed === a.text;
    });

    return { ...a, placed: isPlaced };
  });

  return result;
};

export const responseToText = (response) => {
  return response
    .reduce((acc, word) => {
      const text =
        word.type === FILL_BLANKS_TYPE.BLANK
          ? `<${word.displayed}>`
          : word.text;
      return acc + ' ' + text;
    }, '')
    .trim();
};
