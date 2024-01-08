import { Database, LocalContext } from '@graasp/apps-query-client';
import { AppData, AppSetting, CompleteMember } from '@graasp/sdk';

import { QuestionStatus } from '../../src/components/navigation/questionNavigation/types';
import { QuestionType } from '../../src/config/constants';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      setUpApi({
        database,
        currentMember,
        appContext,
        members,
      }: {
        database?: Partial<Database>;
        currentMember?: CompleteMember;
        appContext?: Partial<LocalContext>;
        members?: CompleteMember[];
      }): Chainable<Element>;

      setupAnalyticsForCheck(
        app_settings: AppSetting[],
        app_data?: AppData[],
        members?: CompleteMember[]
      ): Chainable;

      setupResultTablesByUserForCheck(
        app_settings: AppSetting[],
        app_data: AppData[],
        members: CompleteMember[]
      ): Chainable;

      setupResultTablesByQuestionForCheck(
        app_settings: AppSetting[],
        app_data: AppData[],
        members: CompleteMember[]
      ): Chainable;

      switchQuestionType(type: QuestionType): Chainable;

      checkExplanationPlay(explanation: string): Chainable;

      checkExplanationField(explanation: string): Chainable;

      fillExplanation(explanation: string): Chainable;

      checkHintsPlay(hints: string): Chainable;

      checkHintsField(hints: string): Chainable;

      fillHints(hints: string): Chainable;

      checkQuizNavigationStatus(questionStatus: QuestionStatus): Chainable;

      checkQuizNavigationStatus(questionStatus: QuestionStatus): Chainable;

      /**
       * Command to check that the progression of attempts is displayed correctly.
       * Also checks that the number of attempts are styled correctly
       * if answer is correct or not.
       *
       * @param questionId the id of the question.
       * @param numberOfAttempts the total number of attempts for the question.
       * @param currentAttempts the current number of time the user answered.
       * @param isCorrect is the user's answer correct.
       */
      checkQuizNavigation({
        questionId,
        numberOfAttempts,
        currentAttempts,
        isCorrect,
      }: {
        questionId: string;
        numberOfAttempts: number;
        currentAttempts: number;
        isCorrect?: boolean;
      }): Chainable;

      checkErrorMessage({
        errorMessage,
        severity,
      }: {
        errorMessage?: string;
        severity?: 'error' | 'warning';
      }): Chainable;
    }
  }
}
