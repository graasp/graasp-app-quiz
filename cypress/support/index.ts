import { AppData, AppSetting, CompleteMember } from '@graasp/sdk';

import { QuestionType } from '../../src/config/constants';
import { Database, LocalContext } from '@graasp/apps-query-client';

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
    }
  }
}
