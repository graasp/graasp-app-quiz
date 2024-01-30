import Box from '@mui/material/Box';

type Props = {
  children: JSX.Element;
  tab: number;
  index: number;
};

const TabPanel = ({ children, tab, index }: Props) =>
  tab === index && <Box>{children}</Box>;

export default TabPanel;
