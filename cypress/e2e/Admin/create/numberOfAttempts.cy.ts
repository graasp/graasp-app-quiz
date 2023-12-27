import { Context, PermissionLevel } from '@graasp/sdk';

import {
  NUMBER_OF_ATTEMPTS_DECREASE_BTN_CY,
  NUMBER_OF_ATTEMPTS_INCREASE_BTN_CY,
  NUMBER_OF_ATTEMPTS_INPUT_CY,
  dataCyWrapper,
} from '../../../../src/config/selectors';
import { APP_SETTINGS, getAppSetting } from '../../../fixtures/appSettings';

const DEFAULT_NUMBER_ATTEMPTS = 1;

const checkInputValueEquals = (expectedValue: string) => {
  cy.get(`${dataCyWrapper(NUMBER_OF_ATTEMPTS_INPUT_CY)} input`).should(
    'have.value',
    expectedValue
  );
};

const writeNumberOfAttempts = (numberOfAttemps: string) => {
  cy.get(`${dataCyWrapper(NUMBER_OF_ATTEMPTS_INPUT_CY)} input`).clear();
  cy.get(`${dataCyWrapper(NUMBER_OF_ATTEMPTS_INPUT_CY)} input`).type(
    numberOfAttemps
  );
  // explicitly loose the focus to test that the input is still correct.
  cy.get(`${dataCyWrapper(NUMBER_OF_ATTEMPTS_INPUT_CY)} input`).blur();
};

const updateNumberOfAttemptsWithButtons = (
  increment: boolean,
  numberOfIncrements = 1
) => {
  const dataCy = increment
    ? NUMBER_OF_ATTEMPTS_INCREASE_BTN_CY
    : NUMBER_OF_ATTEMPTS_DECREASE_BTN_CY;

  for (let i = 0; i < numberOfIncrements; i++) {
    cy.get(`${dataCyWrapper(dataCy)}`).click();
  }
};

const decrementNumberOfAttempts = (numberOfDecrements = 1) => {
  updateNumberOfAttemptsWithButtons(false, numberOfDecrements);
};

const incrementNumberOfAttempts = (numberOfDecrements = 1) => {
  updateNumberOfAttemptsWithButtons(true, numberOfDecrements);
};

describe('Number of attempts', () => {
  describe('Empty AppSettings', () => {
    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: [],
        },
        appContext: {
          permission: PermissionLevel.Admin,
          context: Context.Builder,
        },
      });
      cy.visit('/');
    });

    it('Check that empty AppSetting has default number of attempts', () => {
      checkInputValueEquals(`${DEFAULT_NUMBER_ATTEMPTS}`);
    });

    it("Can't decrement if value = 1", () => {
      checkInputValueEquals(`${DEFAULT_NUMBER_ATTEMPTS}`);
      decrementNumberOfAttempts();
      checkInputValueEquals(`${DEFAULT_NUMBER_ATTEMPTS}`);
    });

    it('Increment and decrement using buttons', () => {
      const NUMBER_OF_INCREMENT = 10;
      const NUMBER_OF_DECREMENT = 5;
      checkInputValueEquals(`${DEFAULT_NUMBER_ATTEMPTS}`);
      incrementNumberOfAttempts(NUMBER_OF_INCREMENT);
      checkInputValueEquals(`${DEFAULT_NUMBER_ATTEMPTS + NUMBER_OF_INCREMENT}`);
      decrementNumberOfAttempts(NUMBER_OF_DECREMENT);
      checkInputValueEquals(
        `${DEFAULT_NUMBER_ATTEMPTS + NUMBER_OF_INCREMENT - NUMBER_OF_DECREMENT}`
      );
    });

    it("Can't write text in number of attempts input", () => {
      checkInputValueEquals(`${DEFAULT_NUMBER_ATTEMPTS}`);
      writeNumberOfAttempts('This is an invalid number !');
      checkInputValueEquals(`${DEFAULT_NUMBER_ATTEMPTS}`);
    });

    it("Can't write negative numbers", () => {
      checkInputValueEquals(`${DEFAULT_NUMBER_ATTEMPTS}`);
      writeNumberOfAttempts('-5');
      checkInputValueEquals(`${5}`);
    });

    it('Write valid number', () => {
      checkInputValueEquals(`${DEFAULT_NUMBER_ATTEMPTS}`);
      writeNumberOfAttempts('10');
      checkInputValueEquals(`${10}`);
    });
  });

  describe.only('Has AppSettings', () => {
    const NUMBER_OF_ATTEMPTS = 3;

    beforeEach(() => {
      cy.setUpApi({
        database: {
          appSettings: getAppSetting(APP_SETTINGS, NUMBER_OF_ATTEMPTS),
        },
        appContext: {
          permission: PermissionLevel.Admin,
          context: Context.Builder,
        },
      });
      cy.visit('/');
    });

    it('Check that AppSetting has correct number of attempts', () => {
      checkInputValueEquals(`${NUMBER_OF_ATTEMPTS}`);
    });

    it('Increment and decrement using buttons', () => {
      const NUMBER_OF_INCREMENT = 10;
      const NUMBER_OF_DECREMENT = 5;
      checkInputValueEquals(`${NUMBER_OF_ATTEMPTS}`);
      incrementNumberOfAttempts(NUMBER_OF_INCREMENT);
      checkInputValueEquals(`${NUMBER_OF_ATTEMPTS + NUMBER_OF_INCREMENT}`);
      decrementNumberOfAttempts(NUMBER_OF_DECREMENT);
      checkInputValueEquals(
        `${NUMBER_OF_ATTEMPTS + NUMBER_OF_INCREMENT - NUMBER_OF_DECREMENT}`
      );
    });

    it('Write valid number', () => {
      checkInputValueEquals(`${NUMBER_OF_ATTEMPTS}`);
      writeNumberOfAttempts('10');
      checkInputValueEquals(`${10}`);
    });
  });
});
