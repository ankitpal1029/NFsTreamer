import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./panel.html.css";
import InfoBar from "../components/panel/infobar/infobar";
import Input from "../components/panel/input/input";
import Messages from "../components/panel/messages/messages";
import { AppBar, Box, Tab, Tabs, Typography, useTheme } from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";

declare global {
  interface Window {
    Twitch: any;
  }
}

interface IMessageFormat {
  user: string;
  text: string;
}

let socket: any;

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

//function a11yProps(index: number) {
//return {
//id: `full-width-tab-${index}`,
//"aria-controls": `full-width-tabpanel-${index}`,
//};
//}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      //aria-labelledby={`full-width-tab-${index}`}
      className="w-full"
      {...other}
    >
      {value === index && <Box sx={{ marginTop: 10 }}>{children}</Box>}
    </div>
  );
}

const PanelView: React.FC = () => {
  const room = "something";
  const [userId, setUserId] = useState("not on twitch");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessageFormat[]>([]);
  //const ENDPOINT = "http://localhost:5000";
  const ENDPOINT = "https://0e00-49-205-85-217.ngrok.io";

  const theme = useTheme();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if (window.Twitch) {
      window.Twitch.ext.onAuthorized(function (auth: any) {
        //window.Twitch.ext.rig.log(auth.userId);
        //window.Twitch.ext.rig.log(io);
        //console.log("bitch");

        setUserId(auth.userId);

        //window.Twitch.ext.rig.log("socket data", socket);
      });
    } else {
      console.log("you're not on twitch or twitch rig");
    }

    socket = io(ENDPOINT);
    socket.emit("join", { name: userId, room }, (error: any) => {
      if (error) {
        alert(error);
      }
    });
    //window.Twitch.ext.rig.log(socket);
    //console.log("socket data", socket);
    return () => {
      socket.disconnect();
      socket.off();
    };
  }, [ENDPOINT, userId]);

  useEffect(() => {
    socket.on(
      "message",
      (msg: IMessageFormat) => {
        setMessages([...messages, msg]);
      },
      []
    );
  });

  const sendMessage = (event: any) => {
    event.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => {
        setMessage("");
      });
    }
    console.log(message, messages);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setValue(index);
  };

  return (
    <div className="outerContainer">
      <div className="container">
        {/*<InfoBar room={room} />*/}

        <AppBar>
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
              //{...a11yProps(0)}
              icon={<RestoreIcon />}
            />
            <Tab
              style={{ fontSize: "10px" }}
              label="My NFTs"
              //{...a11yProps(1)}
              icon={<FavoriteIcon />}
            />
            <Tab
              style={{ fontSize: "10px" }}
              label="Live Chat"
              //{...a11yProps(2)}
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
          <TabPanel value={value} index={0} dir={theme.direction}></TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="text-white text-7xl">Hey</div>
          </TabPanel>
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Box>
              <Messages messages={messages} name={userId} />
            </Box>
            {/*<Input
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
              />*/}
          </TabPanel>
        </SwipeableViews>
      </div>
    </div>
  );
};

export default PanelView;
