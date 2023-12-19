import { AppData, AppSetting, Member } from '@graasp/sdk';

import { QuestionType } from '../../src/config/constants';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // TODO: improve types
      setUpApi(args: any): Chainable;

      setupAnalyticsForCheck(
        app_settings: AppSetting[],
        app_data: AppData, // TODO: check if array or not
        members: Member[]
      ): Chainable;

      setupResultTablesByUserForCheck(
        app_settings: AppSetting[],
        app_data: AppData, // TODO: check if array or not
        members: Member[]
      ): Chainable;

      setupResultTablesByQuestionForCheck(
        app_settings: AppSetting[],
        app_data: AppData, // TODO: check if array or not
        members: Member[]
      ): Chainable;

      switchQuestionType(type: QuestionType): Chainable;

      checkStepStatus(id: string, isCorrect: boolean): Chainable;

      checkExplanationPlay(explanation: string): Chainable;

      checkExplanationField(explanation: string): Chainable;

      fillExplanation(explanation: string): Chainable;
    }
  }
}
