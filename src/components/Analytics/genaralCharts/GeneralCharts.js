import Box from '@mui/material/Box';

import CorrectResponsePerUser from './CorrectResponsePerUser';
import CorrectResponsesPercentage from './CorrectResponsesPercentage';
import QuestionDifficulty from './QuestionDifficulty';

const GeneralCharts = ({ maxWidth, generalMenuLabels, chartRefs }) => {
  return (
    <>
      <Box
        ref={(elm) => (chartRefs.current[generalMenuLabels[0].label] = elm)}
        id={generalMenuLabels[0].link}
      >
        <QuestionDifficulty maxWidth={maxWidth} />
      </Box>
      <Box
        ref={(elm) => (chartRefs.current[generalMenuLabels[1].label] = elm)}
        id={generalMenuLabels[1].link}
      >
        <CorrectResponsePerUser maxWidth={maxWidth} />
      </Box>
      <Box
        ref={(elm) => (chartRefs.current[generalMenuLabels[2].label] = elm)}
        id={generalMenuLabels[2].link}
      >
        <CorrectResponsesPercentage maxWidth={maxWidth} />
      </Box>
    </>
  );
};

export default GeneralCharts;
