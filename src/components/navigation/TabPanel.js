import Box from '@mui/material/Box';

const TabPanel = ({ children, tab, index }) => {
  return tab === index && <Box>{children}</Box>;
};

export default TabPanel;
