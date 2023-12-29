import groupBy from 'lodash.groupby';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CancelOutlined, CheckCircleOutlined } from '@mui/icons-material';
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import { visuallyHidden } from '@mui/utils';

import { Member } from '@graasp/sdk';

import {
  TABLE_BY_USER_ANSWER_DATA_CY,
  TABLE_BY_USER_CONTAINER_CY,
  TABLE_BY_USER_CORRECT_ICON_CY,
  TABLE_BY_USER_DATE_DATA_CY,
  TABLE_BY_USER_ENTRY_CY,
  TABLE_BY_USER_QUESTION_NAME_HEADER_CY,
  buildTableByUserAnswerHeaderCy,
  buildTableByUserCorrectHeaderCy,
  buildTableByUserCy,
  buildTableByUserDateHeaderCy,
  buildTableByUserQuestionHeaderCy,
  buildTableByUserTableBodyCy,
} from '../../config/selectors';
import { getFirstOrUndefined } from '../../utils/array';
import { Order, getComparator, stringComparator } from '../../utils/tableUtils';
import {
  computeCorrectness,
  getQuestionNameFromId,
} from '../context/utilities';
import {
  MultipleChoiceAppDataData,
  QuestionAppDataData,
  QuestionDataAppSetting,
  SliderAppDataData,
  TextAppDataData,
} from '../types/types';

export type Response = {
  data: QuestionAppDataData;
  updatedAt: string;
};

type Props = {
  user: Member;
  questions: QuestionDataAppSetting[];
  responses: Response[];
  handleQuestionClicked: (qId: string) => void;
};

/**
 * Component that represents a table for a given users along with his responses to the quiz
 *
 * @param {Member} user The member
 * @param questions The list of questions in the quiz
 * @param responses The list of responses that the current user gave
 * @param handleQuestionClicked A callback function that is called when a question is clicked
 */
const TableByUser = ({
  user,
  questions,
  responses,
  handleQuestionClicked,
}: Props) => {
  const { t } = useTranslation();
  const [order, setOrder] = useState<(typeof Order)[keyof typeof Order]>(
    Order.ASC
  );

  /**
   * List of question names that the user answered
   */
  const [questionNames, setQuestionNames] = useState(
    responses
      .map((res) => getQuestionNameFromId(questions, res.data.questionId))
      .filter((r): r is string => Boolean(r))
      .reduce((result, question) => {
        const index = result.filter((entry) => entry[0] === question).length;
        result.push([question, index]);
        return result;
      }, [] as [string, number][])
  );

  /**
   * Map of responses grouped by question name
   */
  const [responsesByQuestionName, setResponsesByQuestionName] = useState(
    groupBy(responses, (res) =>
      getQuestionNameFromId(questions, res.data.questionId)
    )
  );

  /**
   * Map of question grouped by question name
   */
  const [questionByName, setQuestionByName] = useState(
    groupBy(questions, (question) => question?.data?.question)
  );

  useEffect(
    () =>
      setResponsesByQuestionName(
        groupBy(responses, (res) =>
          getQuestionNameFromId(questions, res.data.questionId)
        )
      ),
    [responses, questions]
  );

  useEffect(
    () =>
      setQuestionNames(
        responses
          .map((res) => getQuestionNameFromId(questions, res.data.questionId))
          .filter((r): r is string => Boolean(r))
          .reduce((result, question) => {
            const index = result.filter(
              (entry) => entry[0] === question
            ).length;
            result.push([question, index]);
            return result;
          }, [] as [string, number][])
      ),
    [responses, questions]
  );

  useEffect(
    () =>
      setQuestionByName(
        groupBy(questions, (question) => question?.data?.question)
      ),
    [questions]
  );

  /**
   * Helper function to invert the current order when clicking on sorted column header
   */
  const handleRequestSort = () => {
    const isAsc = order === Order.ASC;
    setOrder(isAsc ? Order.DESC : Order.ASC);
  };

  /**
   * Helper function to extract the response from a question name
   *
   * @param {string} qName The name of the question
   * @param {number} qIdx The index of the question when multiple answers
   * @returns A user response
   */
  const getResponseForQuestionName = (qName: string, qIdx: number) => {
    return responsesByQuestionName[qName]?.at(qIdx);
  };

  /**
   * Helper function to extract the data of one question given its name for the current user.
   *
   * @param {string} qName The name of the question
   * @param {number} qIdx The index of the question when multiple answers
   * @returns {string} Response for given user.
   */
  const getResponseDataForQuestionName = (qName: string, qIdx: number) => {
    const data = getResponseForQuestionName(qName, qIdx)?.data;

    if (!data) {
      return '';
    }

    // return the first valid value in three possible name of values or empty if all nullish
    const text = (data as TextAppDataData)?.text;
    if (text) {
      return text;
    }

    const value = (data as SliderAppDataData)?.value;
    if (value) {
      return value;
    }

    const choices = (data as MultipleChoiceAppDataData)?.choices;
    if (choices) {
      return choices.join(', ');
    }

    return '';
  };

  /**
   * Helper function to extract the date at which the user answered the question
   *
   * @param {string} qName The name of the question
   * @param {number} qIdx The index of the question when multiple answers
   * @returns {string} return the date of answer's last modification
   */
  const getResponseDateForQuestionName = (qName: string, qIdx: number) => {
    const updatedAt = getResponseForQuestionName(qName, qIdx)?.updatedAt;

    return updatedAt ? new Date(updatedAt).toDateString() : '';
  };

  return (
    <Box sx={{ mb: 8 }} data-cy={TABLE_BY_USER_CONTAINER_CY}>
      <Stack direction="column" spacing={4}>
        <Typography
          variant="h5"
          component="h5"
          data-cy={buildTableByUserCy(user.id)}
        >
          {user.name}
        </Typography>
        {questionNames.length > 0 ? (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left">
                    <TableSortLabel
                      active={true}
                      direction={order}
                      onClick={handleRequestSort}
                      data-cy={buildTableByUserQuestionHeaderCy(user.id)}
                    >
                      {t('Question')}
                      {
                        <Box component="span" sx={visuallyHidden}>
                          {order === Order.DESC
                            ? t('sorted descending')
                            : t('sorted ascending')}
                        </Box>
                      }
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    align="left"
                    data-cy={buildTableByUserAnswerHeaderCy(user.id)}
                  >
                    {t('Answer')}
                  </TableCell>
                  <TableCell
                    align="left"
                    data-cy={buildTableByUserDateHeaderCy(user.id)}
                  >
                    {t('Date')}
                  </TableCell>
                  <TableCell
                    align="left"
                    data-cy={buildTableByUserCorrectHeaderCy(user.id)}
                  >
                    {t('Correct')}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody data-cy={buildTableByUserTableBodyCy(user.id)}>
                {questionNames
                  ?.sort((a, b) => {
                    const stringA = a[0];
                    const stringB = b[0];
                    return getComparator({ order, comp: stringComparator })(
                      stringA,
                      stringB
                    );
                  })
                  .map(([qName, qIdx]) => (
                    <TableRow
                      key={`${qName}-${qIdx}`}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      data-cy={TABLE_BY_USER_ENTRY_CY}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        align="left"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          const qId = getFirstOrUndefined(questionByName, qName)
                            ?.data.questionId;

                          if (qId) {
                            handleQuestionClicked(qId);
                          } else {
                            console.error(
                              `The clicked question ${qName} doesn't exist.`
                            );
                          }
                        }}
                        data-cy={TABLE_BY_USER_QUESTION_NAME_HEADER_CY}
                      >
                        {qName}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{ maxWidth: 350 }}
                        data-cy={TABLE_BY_USER_ANSWER_DATA_CY}
                      >
                        {getResponseDataForQuestionName(qName, qIdx)}
                      </TableCell>
                      <TableCell
                        align="left"
                        data-cy={TABLE_BY_USER_DATE_DATA_CY}
                      >
                        {getResponseDateForQuestionName(qName, qIdx)}
                      </TableCell>
                      {(() => {
                        const questionData = getFirstOrUndefined(
                          questionByName,
                          qName
                        )?.data;

                        // Only render TableCell if questionData is not undefined
                        if (questionData) {
                          return (
                            <TableCell
                              align="left"
                              data-cy={TABLE_BY_USER_CORRECT_ICON_CY}
                            >
                              {computeCorrectness(
                                questionData,
                                getResponseForQuestionName(qName, qIdx)
                                  ?.data as QuestionAppDataData
                              ) ? (
                                <CheckCircleOutlined color="success" />
                              ) : (
                                <CancelOutlined color="error" />
                              )}
                            </TableCell>
                          );
                        }
                      })()}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography align="center">
            {t('Not yet answered')}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default TableByUser;
