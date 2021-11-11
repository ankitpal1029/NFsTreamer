import * as React from "react";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import RecentNFTs from "../components/panel/recent-nfts";
import LiveChat from "../components/panel/live-chat";
import MyNFTs from "../components/panel/my-nfts";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export default function PanelView() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <Box sx={{ bgcolor: "background.paper", width: 320 }}>
      <AppBar position="fixed">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="full width tabs example"
        >
          <Tab
            style={{ fontSize: "10px" }}
            label="Recent NFTs"
            {...a11yProps(0)}
            icon={<RestoreIcon />}
          />
          <Tab
            style={{ fontSize: "10px" }}
            label="My NFTs"
            {...a11yProps(1)}
            icon={<FavoriteIcon />}
          />
          <Tab
            style={{ fontSize: "10px" }}
            label="Live Chat"
            {...a11yProps(2)}
            icon={<ChatIcon />}
          />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
        style={{ marginTop: "20%" }}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <RecentNFTs />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <MyNFTs />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <LiveChat />
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
