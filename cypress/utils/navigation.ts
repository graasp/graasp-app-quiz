import { Context } from '@graasp/sdk';

import { QuestionDataAppSetting } from '../../src/components/types/types';
import {
  QUESTION_BAR_NEXT_CY,
  QUESTION_BAR_PREV_CY,
  buildQuestionStepDefaultCy,
  dataCyWrapper,
} from '../../src/config/selectors';

/**
 * utils class used to abstract next and prev buttons to navigate.
 */
export class QuizNavigator {
  private currIdx: number;
  private appSettings: QuestionDataAppSetting[];
  private context: Context;

  public constructor({
    initIdx = 0,
    questionSettings,
    context,
  }: {
    initIdx?: number;
    questionSettings: QuestionDataAppSetting[];
    context: Context.Player | Context.Builder;
  }) {
    this.currIdx = initIdx;
    this.appSettings = questionSettings;
    this.context = context;
  }

  private getQuestionId(idx: number) {
    if (idx < 0) {
      throw new Error(`The idx ${idx} can't be smaller than 0.`);
    }

    if (idx >= this.appSettings.length) {
      throw new Error(
        `The idx ${idx} can't be greater than the length of settings.`
      );
    }

    return this.appSettings[this.currIdx].data.questionId;
  }

  public goToNext() {
    if (this.context === Context.Player) {
      cy.get(dataCyWrapper(QUESTION_BAR_NEXT_CY)).click();
    } else {
      const questionId = this.getQuestionId(++this.currIdx);
      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(questionId))).click();
    }
  }

  public goToPrev() {
    if (this.context === Context.Player) {
      cy.get(dataCyWrapper(QUESTION_BAR_PREV_CY)).click();
    } else {
      const questionId = this.getQuestionId(--this.currIdx);
      cy.get(dataCyWrapper(buildQuestionStepDefaultCy(questionId))).click();
    }
  }

  public prevBtnShouldDisabled() {
    if (this.context !== Context.Player) {
      throw new Error(
        `The context ${this.context} doesn't have any previous button.`
      );
    }

    cy.get(dataCyWrapper(QUESTION_BAR_PREV_CY)).should('be.disabled');
  }
}
