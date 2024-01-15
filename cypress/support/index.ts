import { Database, LocalContext } from '@graasp/apps-query-client';
import { AppData, AppSetting, CompleteMember } from '@graasp/sdk';

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

      checkStepStatus(id: string, isCorrect: boolean): Chainable;

      checkExplanationPlay(explanation: string): Chainable;

      checkExplanationField(explanation: string): Chainable;

      fillExplanation(explanation: string): Chainable;

      /**
       * Command to check that the progression of attempts is displayed correctly.
       * Also checks that the number of attempts are styled correctly
       * if answer is correct or not.
       *
       * @param numberOfAttempts the total number of attempts for the question.
       * @param currentAttempts the current number of time the user answered.
       * @param isCorrect is the user's answer correct.
       */
      checkNumberOfAttemptsProgression({
        numberOfAttempts,
        currentAttempts,
        isCorrect,
      }: {
        numberOfAttempts: number;
        currentAttempts: number;
        isCorrect?: boolean;
      }): Chainable;
    }
  }
}
