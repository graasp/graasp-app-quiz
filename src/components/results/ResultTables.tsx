import groupby from 'lodash.groupby';

import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { CircularProgress, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Member } from '@graasp/sdk';

import { hooks } from '../../config/queryClient';
import { TABLE_BY_QUESTION_CONTAINER_CY } from '../../config/selectors';
import {
  useMaxAvailableHeightInWindow,
  useMaxAvailableHeightWithParentHeight,
} from '../../hooks/useMaxAvailableHeight';
import { getFirstOrUndefined } from '../../utils/array';
import {
  Order,
  comparatorArrayByElemName,
  formatInnerLink,
  getComparator,
} from '../../utils/tableUtils';
import { QuizContext } from '../context/QuizContext';
import {
  getAllAppDataByQuestionId,
  getAllAppDataByUserId,
} from '../context/utilities';
import AutoScrollableMenu from '../navigation/AutoScrollableMenu';
import ResultTablesMenu from '../navigation/ResultTablesMenu';
import TabPanel from '../navigation/TabPanel';
import {
  QuestionAppDataData,
  QuestionData,
  QuestionDataAppSetting,
  RefsObject,
} from '../types/types';
import TableByQuestion from './TableByQuestion';
import TableByUser, { Response } from './TableByUser';

const TABLE_BY_QUESTION_PANEL_IDX = 0;
const TABLE_BY_USER_PANEL_IDX = 1;

type Props = {
  headerElem: MutableRefObject<HTMLElement | undefined>;
};

type QuestionWithInnerLink = QuestionDataAppSetting & {
  data: { innerLink: string };
};

type GroupedQuestionsById = {
  [questionId: string]: QuestionWithInnerLink[];
};

/**
 * Component that represents the result tables
 *
 * @param headerElem The element that represents the header, if no header, simply let it to undefined
 * this header is used to calculate the space left for the body of this component
 */
const ResultTables = ({ headerElem }: Props) => {
  const { t } = useTranslation();
  const { data: responses, isLoading } = hooks.useAppData();
  const { data, isLoading: isContextLoading } = hooks.useAppContext();
  const { order, questions } = useContext(QuizContext);
  const questionContainerRef = useRef<null | HTMLElement>(null);
  const userContainerRef = useRef<null | HTMLElement>(null);
  const [tab, setTab] = useState(0);
  const tableMenuElem = useRef<HTMLElement | undefined>(undefined);
  const maxResultViewHeight = useMaxAvailableHeightInWindow(headerElem.current);
  const maxHeightScrollableMenu = useMaxAvailableHeightWithParentHeight(
    maxResultViewHeight,
    tableMenuElem.current
  );
  // Use a ref here, so that we can reset it from the child component (AutoScrollableMenu), without triggering a
  //re-render. We have to reset it in the child component, so that it only scroll to this value only once
  const initiallyClickedQuestion = useRef<string | null>(null);
  const initiallyClickedUser = useRef<string | null>(null);

  /**
   * Store a reference to every TableByQuestion element
   *
   * useRef is used to prevent to component to re-render upon every questionRefs changes
   */
  const questionRefs = useRef<RefsObject<HTMLElement>>({});
  const userRefs = useRef<RefsObject<HTMLElement>>({});

  /**
   * Helper function to extract the data from the questions
   *
   * add a property `innerLink` that represents the link to use as hash link
   */
  const extractQuestionData = useCallback(() => {
    const questionsById = Object.entries(
      groupby(questions, (q) => q.data.questionId)
    );

    // TODO: check this
    const innerLinkQuestionsById = questionsById.reduce(
      (acc: GroupedQuestionsById, [qId, questions]) => {
        acc[qId] = questions.map((question) => ({
          ...question,
          data: {
            ...question.data,
            innerLink: formatInnerLink(question.data.question),
          },
        }));
        return acc;
      },
      {}
    );

    return innerLinkQuestionsById;
  }, [questions]);

  const [questionData, setQuestionData] = useState<GroupedQuestionsById>(
    extractQuestionData()
  );

  /**
   * Callback that is called when a question is clicked on in the
   * tableByUser component, so that we are redirected to the corresponding
   * question in the tableByQuestion
   */
  const handleQuestionClicked = useCallback(
    (qId: string) => {
      const questionsOfId = questionData[qId];
      if (questionsOfId.length > 0) {
        initiallyClickedQuestion.current = questionsOfId[0].data.innerLink;
        setTab(TABLE_BY_QUESTION_PANEL_IDX);
      } else {
        // TODO: check what to do
        console.error(`There is no questions for id ${qId}`);
      }
    },
    [questionData]
  );

  /**
   * Callback that is called when a user is clicked on in the
   * tableByQuestion component, so that we are redirected to the corresponding
   * user in the tableByUser
   */
  const handleUserClicked = useCallback((qName: string) => {
    initiallyClickedUser.current = formatInnerLink(qName);
    setTab(TABLE_BY_USER_PANEL_IDX);
  }, []);

  /**
   * Helper function to get the name of all users that have answered to at least one question.
   *
   * @returns Immutable set of user's id
   */
  const getAllUsers = useCallback(() => {
    return responses?.map((r) => r.member.id);
  }, [responses]);

  const [usersId, setUsersId] = useState(getAllUsers());

  /**
   * Helper function to construct a list that will contain all the members that have responded to at least
   * one question in the quiz
   *
   * Will directly sort the list ascending to navigate more easily in students
   *
   * @returns A list of tuple from user name to its id
   */
  const getMembers = useCallback(() => {
    const listIdNames = data?.members?.reduce((acc, cur) => {
      return usersId?.find((id) => id === cur.id) ? [...acc, cur] : acc;
    }, [] as Member[]);

    // directly sort the list descending
    return listIdNames?.sort(
      getComparator({ order: Order.ASC, comp: comparatorArrayByElemName })
    );
  }, [data, usersId]);

  const [members, setMembers] = useState(getMembers());

  useEffect(() => {
    setMembers(getMembers());
  }, [data, getMembers]);

  useEffect(() => {
    setUsersId(getAllUsers());
  }, [responses, getAllUsers]);

  useEffect(() => {
    setQuestionData(extractQuestionData());
  }, [questions, extractQuestionData]);

  if (isLoading || isContextLoading) {
    return <CircularProgress />;
  }

  return order.length > 0 ? (
    usersId && usersId.length > 0 ? (
      <Stack direction="row" spacing={5}>
        <Box sx={{ maxHeight: maxResultViewHeight }}>
          <ResultTablesMenu
            tab={tab}
            setTab={setTab}
            tableMenuElem={tableMenuElem}
          />
          <Box sx={{ maxHeight: maxHeightScrollableMenu, overflow: 'auto' }}>
            <TabPanel tab={tab} index={TABLE_BY_QUESTION_PANEL_IDX}>
              <AutoScrollableMenu
                links={order?.reduce((accumulator, qId) => {
                  const question = getFirstOrUndefined(questionData, qId);

                  // Check if data is not null or undefined before adding to the accumulator
                  if (question?.data) {
                    accumulator.push({
                      label: question.data.question,
                      link: question.data.innerLink,
                      id: qId,
                    });
                  }

                  return accumulator;
                  // TODO: extract as into a Type ?
                }, [] as { label: string; link: string; id: string }[])}
                elemRefs={questionRefs}
                containerRef={questionContainerRef}
                initiallyClickedId={initiallyClickedQuestion}
              />
            </TabPanel>
            <TabPanel tab={tab} index={TABLE_BY_USER_PANEL_IDX}>
              <AutoScrollableMenu
                links={members?.map(({ id, name }) => {
                  return { label: name, link: formatInnerLink(id), id };
                })}
                elemRefs={userRefs}
                containerRef={userContainerRef}
                initiallyClickedId={initiallyClickedUser}
              />
            </TabPanel>
          </Box>
        </Box>
        <TabPanel tab={tab} index={TABLE_BY_QUESTION_PANEL_IDX}>
          <Box
            sx={{
              overflow: 'auto',
              width: '100%',
              height: maxResultViewHeight,
              pr: 1,
              scrollBehavior: 'smooth',
            }}
            ref={questionContainerRef}
          >
            {order?.map((qId) => {
              const selectedQuestion = getFirstOrUndefined(questionData, qId);

              return (
                selectedQuestion && (
                  <Box
                    key={qId}
                    id={selectedQuestion.data.innerLink}
                    ref={(elm: HTMLElement) =>
                      (questionRefs.current[qId] = elm)
                    }
                  >
                    {members && (
                      <TableByQuestion
                        memberList={members}
                        question={selectedQuestion}
                        responses={getAllAppDataByQuestionId(responses, qId)}
                        handleUserClicked={handleUserClicked}
                      />
                    )}
                  </Box>
                )
              );
            })}
          </Box>
        </TabPanel>
        <TabPanel tab={tab} index={TABLE_BY_USER_PANEL_IDX}>
          <Box
            sx={{
              overflow: 'auto',
              width: '100%',
              height: maxResultViewHeight,
              pr: 1,
              scrollBehavior: 'smooth',
            }}
            ref={userContainerRef}
          >
            {members?.map((member) => {
              const { id } = member;
              return (
                <Box
                  key={id}
                  id={formatInnerLink(id)}
                  ref={(elm: HTMLElement) => (userRefs.current[id] = elm)}
                >
                  <TableByUser
                    user={member}
                    questions={questions}
                    responses={getAllAppDataByUserId(responses, id).map(
                      (appData) => ({
                        ...appData,
                        data: appData.data as QuestionAppDataData,
                      })
                    )} // TODO: fix this type
                    handleQuestionClicked={handleQuestionClicked}
                  />
                </Box>
              );
            })}
          </Box>
        </TabPanel>
      </Stack>
    ) : (
      <Typography align="center" data-cy={TABLE_BY_QUESTION_CONTAINER_CY}>
        {t('No users answered the quiz yet')}
      </Typography>
    )
  ) : (
    <Typography align="center" data-cy={TABLE_BY_QUESTION_CONTAINER_CY}>
      {t("There isn't any question to display")}
    </Typography>
  );
};

export default ResultTables;
