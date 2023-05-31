import {APP_SETTINGS_2, APP_SETTINGS_3} from "../../../fixtures/appSettings";
import {
  ANALYTICS_CONTAINER_CY,
  ANALYTICS_GENERAL_CORRECT_RESPONSE_PER_USER,
  ANALYTICS_GENERAL_CORRECT_RESPONSE_PERCENTAGE,
  ANALYTICS_GENERAL_QUIZ_PERFORMANCE,
  ANALYTICS_GENERAL_TAB_MENU_CY,
  buildAnalyticsDetailedQuestionTabMenuCy,
  buildAutoScrollableMenuLinkCy,
  dataCyWrapper
} from "../../../../src/config/selectors";
import {APP_DATA_3} from "../../../fixtures/appData";
import {MEMBERS_RESULT_TABLES} from "../../../fixtures/members";
import {APP_SETTING_NAMES} from "../../../../src/config/constants";
import {getSettingsByName} from "../../../../src/components/context/utilities";
import {hexToRGB} from "../../../utils/Color";
import theme from "../../../../src/layout/theme";

const generalCharts = [
  {label: 'Quiz performance', selector: ANALYTICS_GENERAL_QUIZ_PERFORMANCE, chartTitle: 'Number of correct/incorrect responses per question'},
  {label: 'Users performance', selector: ANALYTICS_GENERAL_CORRECT_RESPONSE_PER_USER, chartTitle: 'Number of correct responses per user'},
  {label: 'Quiz correct response percentage', selector: ANALYTICS_GENERAL_CORRECT_RESPONSE_PERCENTAGE, chartTitle: 'Quiz correct response percentage'}
]

describe('Analytics General', () => {
  it('General Analytics no app data', () => {
    cy.setupAnalyticsForCheck(APP_SETTINGS_2);

    // if empty app data, then should display that no user have answered the quiz yet
    cy.get(dataCyWrapper(ANALYTICS_CONTAINER_CY)).should(
        'have.text',
        'No users answered the quiz yet'
    );
  })

  /**
   * Check the layout when opening the Analytics tab
   */
  it('Analytics tab with data, layout correctly displayed', () => {
    cy.setupAnalyticsForCheck(
        APP_SETTINGS_3,
        APP_DATA_3,
        MEMBERS_RESULT_TABLES
    );

    // The general tab should be present
    cy.get(dataCyWrapper(ANALYTICS_GENERAL_TAB_MENU_CY)).scrollIntoView().should(
        'have.text',
        'General'
    )

    // Check that initially General tab is selected
    cy.get(dataCyWrapper(ANALYTICS_GENERAL_TAB_MENU_CY)).scrollIntoView().should(
        'have.attr', 'aria-selected', 'true'
    )

    // All the question of the quiz should have their own tab, to navigate to detailed questions
    getSettingsByName(APP_SETTINGS_3, APP_SETTING_NAMES.QUESTION).forEach(q => {
      cy.get(dataCyWrapper(buildAnalyticsDetailedQuestionTabMenuCy(q.data.question))).scrollIntoView().should(
          'have.text',
          q.data.question
      )
    })

    // The charts should correctly have en entry in the menu
    generalCharts.forEach(( {label}) => {
      cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(label))).scrollIntoView().should(
          'have.text',
          label
      )
    })

    generalCharts.forEach(({selector}) => {
      cy.get(dataCyWrapper(selector)).scrollIntoView().should('be.visible')
    })

  })

  it('Analytics, click chart in menu goes to correct charts', () => {
    cy.setupAnalyticsForCheck(
        APP_SETTINGS_3,
        APP_DATA_3,
        MEMBERS_RESULT_TABLES
    );

    generalCharts.forEach(({label: outerLabel, selector, chartTitle}, index) => {

      cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(outerLabel))).scrollIntoView().click()
      // check that correct menu is selected
      verifySelectedMenu(index)

      cy.get(dataCyWrapper(selector)).should('be.visible')

      // Check the title of the chart as well
      cy.get(dataCyWrapper(selector)).find('.gtitle').should('have.text', chartTitle)
    })
  })
})

const verifySelectedMenu = (outerIndex) => {
  const rgbBorderColor = hexToRGB(theme.palette.primary.main);

  generalCharts.forEach(({label}, index) => {
    if (outerIndex === index) {
      cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(label))).should(
          'have.css',
          'border-color',
          rgbBorderColor
      );
    } else {
      cy.get(dataCyWrapper(buildAutoScrollableMenuLinkCy(label))).should(
          'have.css',
          'border-color',
          'rgba(0, 0, 0, 0)'
      );
    }
  })
}