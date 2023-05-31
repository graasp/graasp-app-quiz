import { getSettingsByName } from '../../../../src/components/context/utilities';
import {
  APP_SETTING_NAMES,
  QUESTION_TYPES,
} from '../../../../src/config/constants';
import {
  buildAnalyticsDetailedChartCy,
  buildAnalyticsDetailedQuestionTabMenuCy,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import { ANSWER_REGEXP } from '../../../../src/utils/fillInTheBlanks';
import { APP_DATA_3 } from '../../../fixtures/appData';
import { APP_SETTINGS_3 } from '../../../fixtures/appSettings';
import { MEMBERS_RESULT_TABLES } from '../../../fixtures/members';
import { verifySelectedMenu } from '../../../utils/AutoScrollableMenuSelected';

describe('Analytics Detailed', () => {
  it('Selecting detailed chart display correct answer frequency chart based on question type', () => {
    cy.setupAnalyticsForCheck(
      APP_SETTINGS_3,
      APP_DATA_3,
      MEMBERS_RESULT_TABLES
    );

    getSettingsByName(APP_SETTINGS_3, APP_SETTING_NAMES.QUESTION).forEach(
      (q) => {
        // Click on every question
        cy.get(
          dataCyWrapper(
            buildAnalyticsDetailedQuestionTabMenuCy(q.data.question)
          )
        )
          .scrollIntoView()
          .click();

        switch (q.data.type) {
          case QUESTION_TYPES.FILL_BLANKS:
            q.data.text
              .match(ANSWER_REGEXP)
              .map((word, idx) => {
                return {
                  label: `Question answer frequency blank ${idx + 1}`,
                };
              })
              .forEach((qLabel, idx, labels) => {
                // Goes to chart
                cy.get(
                  dataCyWrapper(buildAnalyticsDetailedChartCy(qLabel.label))
                )
                  .scrollIntoView()
                  .should('be.visible');

                // assert chart title
                cy.get(
                  dataCyWrapper(buildAnalyticsDetailedChartCy(qLabel.label))
                )
                  .find('.gtitle')
                  .should(
                    'have.text',
                    `Answers distribution -${q.data.question} - blank ${
                      idx + 1
                    }`
                  );

                // verify that the correctly selected menu is visible
                verifySelectedMenu(idx, labels);
              });
            break;
          case QUESTION_TYPES.SLIDER:
          case QUESTION_TYPES.TEXT_INPUT:
          case QUESTION_TYPES.MULTIPLE_CHOICES:
            // go to chart
            cy.get(
              dataCyWrapper(
                buildAnalyticsDetailedChartCy('Question answer frequency')
              )
            )
              .scrollIntoView()
              .should('be.visible');

            // assert chart title
            cy.get(
              dataCyWrapper(
                buildAnalyticsDetailedChartCy('Question answer frequency')
              )
            )
              .find('.gtitle')
              .should('have.text', `Answers distribution -${q.data.question}`);

            // verify the correct menu is selected
            verifySelectedMenu(0, [{ label: 'Question answer frequency' }]);
            break;
          default:
            throw new Error('Unknown question type, test should fail');
        }
      }
    );
  });
});
