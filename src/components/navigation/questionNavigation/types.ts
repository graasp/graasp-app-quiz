export enum QuestionStepStyleKeys {
  DEFAULT = 'default',
  CORRECT = 'correct',
  INCORRECT = 'incorrect',
  REMAIN_ATTEMPTS = 'remain_attempts',
}

export type QuestionStatus = `${QuestionStepStyleKeys}`;