import {
  Paper, Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Typography
} from '@mui/material';
import { CheckCircleOutlined, CancelOutlined } from "@mui/icons-material";

import { QUESTION_TYPES } from '../../config/constants';
import {computeCorrectness} from "../context/utilities";
import Box from "@mui/material/Box";

const TableByQuestion = ({ question, userList, responses }) => {
  // TODO Add translation plugin

  /**
   * Helper function to extract the response from a particular user
   *
   * @param {string} userId The name of the user
   * @returns A user response (May be undefined if user didn't respond to the current question)
   */
  const getResponseForUserId = (userId) => {
    return responses.find(
        ({ memberId }) => memberId === userId
    )
  }

  /**
   * Helper function to extract the data of one user for a specific question.
   *
   * @param {string} userId The name of the user
   * @returns {string} Response for given user.
   */
  const getResponseDataForUserId = (userId) => {
    const { text, value, choices } = getResponseForUserId(userId)?.data ?? { text: '' }

    switch (question.data.type) {
      case QUESTION_TYPES.TEXT_INPUT:
      case QUESTION_TYPES.FILL_BLANKS:
        return text;
      case QUESTION_TYPES.SLIDER:
        return value;
      case QUESTION_TYPES.MULTIPLE_CHOICES:
        return choices?.join(', ');
      default:
        return '';
    }
  };

  /**
   * Helper function to extract the date at which the user answered a specific question
   *
   * @param {string} userId The name of the user
   * @returns {*|string} return the date of answer's last modification
   */
  const getResponseDateForUserId = (userId) => {
    const updatedAt  = getResponseForUserId(userId)?.updatedAt

    return updatedAt !== undefined ? new Date(updatedAt).toDateString() : ''
  }

  return (
      <Box sx={{mb: 8}}>
        <Stack direction={"column"} spacing={4}>
          <Typography variant={"h5"} component={"h5"}>{question.data.question}</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Answer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Correct</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.map(
                    (
                        userId // TODO add a way to sort the user by their member ID
                    ) => (
                        <TableRow
                            key={userId}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row" align="left">
                            {userId}
                          </TableCell>
                          <TableCell align="left" sx={{maxWidth: 350}}>
                            {getResponseDataForUserId(userId)}
                          </TableCell>
                          <TableCell align="left">
                            {getResponseDateForUserId(userId)}
                          </TableCell>
                          <TableCell align="left">
                            {
                              computeCorrectness(getResponseForUserId(userId)?.data, question.data) ?
                                  <CheckCircleOutlined color={"success"} /> :
                                  <CancelOutlined color={"error"} />
                            }
                          </TableCell>
                        </TableRow>
                    )
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
  );
};

export default TableByQuestion;
