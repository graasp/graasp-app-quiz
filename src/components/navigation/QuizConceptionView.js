import Box from "@mui/material/Box";
import {Tab, Tabs} from "@mui/material";
import {useState} from "react";
import CreateView from "../create/CreateView";
import ResultTables from "../results/ResultTables";

const QuizConceptionView = () => {

  const [tab, setTab] = useState(0)

  const TabPanel = ({children, tab, index}) => {
    return (
        tab === index && (
            <Box sx={{pt: 4}}>
              {children}
            </Box>)
    )
  }

  return (
      <Box sx={{width: '100%'}}>
        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)}>
            <Tab label="Create Quiz"/>
            <Tab label="Results"/>
          </Tabs>
        </Box>
        <TabPanel tab={tab} index={0}>
          <CreateView/>
        </TabPanel>
        <TabPanel tab={tab} index={1}>
          <ResultTables/>
        </TabPanel>
      </Box>
  )
}

export default QuizConceptionView;