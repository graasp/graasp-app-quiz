import { getSettingsByName } from '../../../src/components/context/utilities';
import {
  APP_SETTING_NAMES,
  QuestionType,
} from '../../../src/config/constants';
import {
  buildAnalyticsDetailedChartCy,
  buildAnalyticsDetailedQuestionTabMenuCy,
  dataCyWrapper,
} from '../../../src/config/selectors';
import { ANSWER_REGEXP } from '../../../src/utils/fillInTheBlanks';
import { APP_DATA_LOT_QUESTIONS_LOT_USERS } from '../../fixtures/appData';
import { APP_SETTINGS_LOT_QUESTIONS } from '../../fixtures/appSettings';
import { MEMBERS_RESULT_TABLES } from '../../fixtures/members';
import { verifySelectedMenu } from '../../utils/autoScrollableMenuSelected';

describe('Analytics Detailed', () => {
  
  it('Selecting detailed chart display correct answer frequency chart based on question type', () => {
    cy.setupAnalyticsForCheck(
      APP_SETTINGS_LOT_QUESTIONS,
      APP_DATA_LOT_QUESTIONS_LOT_USERS,
      MEMBERS_RESULT_TABLES
    );

    getSettingsByName(
      APP_SETTINGS_LOT_QUESTIONS,
      APP_SETTING_NAMES.QUESTION
    ).forEach((q) => {
      // Click on every question
      cy.get(
        dataCyWrapper(buildAnalyticsDetailedQuestionTabMenuCy(q.data.question))
      ).scrollIntoView();
      cy.get(
        dataCyWrapper(buildAnalyticsDetailedQuestionTabMenuCy(q.data.question))
      ).click();

      switch (q.data.type) {
        case QuestionType.FILL_BLANKS:
          q.data.text
            .match(ANSWER_REGEXP)
            .map((word, idx) => 
              // todo: use id instead of label
               ({
                label: `Question answer frequency blank ${idx + 1}`,
                id: `Question answer frequency blank ${idx + 1}`,
              })
            )
            .forEach((qLabel, idx, labels) => {
              // Goes to chart
              cy.get(
                dataCyWrapper(buildAnalyticsDetailedChartCy(qLabel.label))
              ).scrollIntoView();
              cy.get(
                dataCyWrapper(buildAnalyticsDetailedChartCy(qLabel.label))
              ).should('be.visible');

              // assert chart title
              cy.get(dataCyWrapper(buildAnalyticsDetailedChartCy(qLabel.label)))
                .find('.gtitle')
                .should(
                  'have.text',
                  `Answers distribution -${q.data.question} - blank ${idx + 1}`
                );

              // verify that the correctly selected menu is visible
              verifySelectedMenu(idx, labels);
            });
          break;
        case QuestionType.SLIDER:
        case QuestionType.TEXT_INPUT:
        case QuestionType.MULTIPLE_CHOICES:
          // go to chart
          cy.get(
            dataCyWrapper(
              buildAnalyticsDetailedChartCy('Question answer frequency')
            )
          ).scrollIntoView();
          cy.get(
            dataCyWrapper(
              buildAnalyticsDetailedChartCy('Question answer frequency')
            )
          ).should('be.visible');

          // assert chart title
          cy.get(
            dataCyWrapper(
              buildAnalyticsDetailedChartCy('Question answer frequency')
            )
          )
            .find('.gtitle')
            .should('have.text', `Answers distribution -${q.data.question}`);

          // verify the correct menu is selected
          // todo: use id instead of label
          verifySelectedMenu(0, [
            {
              label: 'Question answer frequency',
              id: 'Question answer frequency',
            },
          ]);
          break;
        default:
          throw new Error('Unknown question type, test should fail');
      }
    });
  });
});
