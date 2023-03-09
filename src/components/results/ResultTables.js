import {
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import {hooks} from "../../config/queryClient";
import {useContext} from "react";
import {QuizContext} from "../context/QuizContext";
import {getAppDataByQuestionId, getDataWithId} from "../context/utilities";

const ResultTables = () => {

  const {data: responses, isLoading} = hooks.useAppData();
  const {order, questions} = useContext(QuizContext);


  if (isLoading) {
    return <CircularProgress/>;
  }


  /**
   * Helper function to get the name of all users that have answered to at least one question.
   *
   * @returns Immutable set of user's memberId
   */
  const getAllUser = () => {
    return responses.map(r => r.memberId).toSet();
  }

  /**
   * Helper function to extract the data of one user for a specific question.
   *
   * @param {string} qId The id of the question
   * @param {string} userMemberId The name of the user
   * @returns {string} Response for given user and data.
   */
  const getQuestionData = (qId, userMemberId) => {
    const {text, value, choices} = getAppDataByQuestionId(responses.filter(res => res.memberId === userMemberId), qId).data;
    return text ?? (value ?? choices?.join(", "))
  }

  return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                Question / User
              </TableCell>
              {
                order.map(qId =>
                    <TableCell key={qId} align="left">
                      {getDataWithId(questions, qId)?.data?.question}
                    </TableCell>)
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              getAllUser().map(user => (
                  <TableRow key={user} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                    <TableCell component="th" scope="row">
                      {user}
                    </TableCell>
                    {order.map(qId => (
                        <TableCell align="left">
                          {getQuestionData(qId, user)}
                        </TableCell>
                    ))}
                  </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>
  )
}

export default ResultTables