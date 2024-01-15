import { groupBy } from 'lodash';

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
  getLastDataByGroup,
  getQuestionNameFromId,
  getResponseValue,
} from '../context/utilities';
import { QuestionAppDataData, QuestionDataAppSetting } from '../types/types';

export type Response = {
  data: QuestionAppDataData;
  createdAt: string;
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
   * Map of responses grouped by question name
   */
  const [responsesByQuestionName, setResponsesByQuestionName] = useState<{
    [x: string]: Response;
  }>({});

  /**
   * Map of question grouped by question name
   */
  const [questionByName, setQuestionByName] = useState(
    groupBy(questions, (question) => question?.data?.question)
  );

  useEffect(() => {
    const groupedResponses = groupBy(responses, (res) =>
      getQuestionNameFromId(questions, res.data.questionId)
    );

    const responsesByQuestionName = getLastDataByGroup(groupedResponses);

    setResponsesByQuestionName(responsesByQuestionName);
  }, [responses, questions]);

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
   * @returns A user response
   */
  const getResponseForQuestionName = (qName: string) => {
    return responsesByQuestionName[qName];
  };

  /**
   * Helper function to extract the data of one question given its name for the current user.
   *
   * @param {string} qName The name of the question
   * @returns {string} Response for given user.
   */
  const getResponseDataForQuestionName = (qName: string) => {
    return getResponseValue(getResponseForQuestionName(qName)?.data);
  };

  /**
   * Helper function to extract the date at which the user answered the question
   *
   * @param {string} qName The name of the question
   * @returns {string} return the date of answer's last modification
   */
  const getResponseDateForQuestionName = (qName: string) => {
    const createdAt = getResponseForQuestionName(qName)?.createdAt;

    return createdAt ? new Date(createdAt).toDateString() : '';
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
        {Object.keys(questionByName).length > 0 ? (
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
                {Object.entries(questionByName)
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

                      {(() => {
                        const questionData = getFirstOrUndefined(
                          questionByName,
                          qName
                        )?.data;

                        const responseData =
                          getResponseDataForQuestionName(qName);

                        // Only render TableCell if questionData is not undefined
                        if (questionData && responseData) {
                          return (
                            <>
                              <TableCell
                                align="left"
                                sx={{ maxWidth: 350 }}
                                data-cy={TABLE_BY_USER_ANSWER_DATA_CY}
                              >
                                {responseData}
                              </TableCell>
                              <TableCell
                                align="left"
                                data-cy={TABLE_BY_USER_DATE_DATA_CY}
                              >
                                {getResponseDateForQuestionName(qName)}
                              </TableCell>
                              <TableCell
                                align="left"
                                data-cy={TABLE_BY_USER_CORRECT_ICON_CY}
                              >
                                {computeCorrectness(
                                  questionData,
                                  getResponseForQuestionName(qName)
                                    ?.data as QuestionAppDataData
                                ) ? (
                                  <CheckCircleOutlined color="success" />
                                ) : (
                                  <CancelOutlined color="error" />
                                )}
                              </TableCell>
                            </>
                          );
                        } else {
                          return (
                            <TableCell
                              colSpan={3}
                              align="center"
                              data-cy={TABLE_BY_USER_DATE_DATA_CY}
                            >
                              {t('Not yet answered')}
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
          <Typography align="center">{t('Not yet answered')}</Typography>
        )}
      </Stack>
    </Box>
  );
};

export default TableByUser;
