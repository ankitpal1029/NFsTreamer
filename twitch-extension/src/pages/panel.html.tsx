import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./panel.html.css";
import Messages from "../components/panel/messages/messages";
import { useTheme } from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatIcon from "@mui/icons-material/Chat";
import UserNFT from "../components/user-nft/user-nft";
import AvailableNFTs from "../components/available-nfts/available-nfts";
import { baseURL } from "../lib/axios_config";

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


  const Panel = ({
    tab, 
    messages, 
    userId, 
    setMessage, 
    sendMessage
    }: {
      tab: number, 
      messages: IMessageFormat[], 
      userId: string,
      setMessage: React.Dispatch<React.SetStateAction<string>>,
      sendMessage: (event: any) => void
    }) => {
      switch (tab) {
        case 0:
                return (
                <div id="first" className="p-4">
                    <Messages messages={messages} name={userId} />
                </div>
                );

        case 1:
                return (
                  <div id="first" className="p-4">
                   <UserNFT setMessage={setMessage} sendMessage={sendMessage} />
                  </div>
                  );
        default:
        return(<div>error</div>);
        
      }
    }

  const TabHeader = ({handleChange, tab}: {handleChange: (newValue: number) => void, tab: number}) => {
      switch(tab){
          case 0: // underline 0
            return (
              <ul id="tabs" className="inline-flex w-full px-1 pt-2 ">
                <li className={`px-4 py-2 -mb-px font-semibold text-purple-800  border-purple-400 rounded-t border-b-2`}
                  onClick={() => handleChange(0)}>
                  Live Chat
                </li>
                <li className={`px-4 py-2 font-semibold text-purple-800 rounded-t opacity-50`} 
                  onClick={() => handleChange(1)}>
                  My NFTs
                </li>
              </ul>
              )
          case 1: // underline 1
            return (
              <ul id="tabs" className="inline-flex w-full px-1 pt-2 ">
                <li className={`px-4 py-2 font-semibold text-purple-800  border-purple-400 rounded-t opacity-50`}
                  onClick={() => handleChange(0)}>
                  Live Chat
                </li>
                <li className={`px-4 py-2 -mb-px font-semibold text-purple-800 rounded-t  border-b-2`} 
                  onClick={() => handleChange(1)}>
                  My NFTs
                </li>
              </ul>
              )
          default: 
                return <div>error</div>
        }
    }

const PanelView: React.FC = () => {
  const room = "something";
  const [userId, setUserId] = useState("not on twitch");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessageFormat[]>([]);
  const ENDPOINT = baseURL;

  const [tabNumber, setTabNumber] = React.useState<number>(0);

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

    socket = io(`${ENDPOINT}`, {
      path: "/chat",
    });
    socket.emit("join", { name: userId, room }, (error: any) => {
      if (error) {
        alert(error);
      }
    });

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


  const handleChange = (newValue: number) => {
      setTabNumber(newValue);
  }

    return(
    <div className="w-auto mx-auto mt-4  rounded">
    <TabHeader handleChange={handleChange} tab={tabNumber}/>
      <div id="tab-contents">
        <Panel tab={tabNumber} messages={messages} userId={userId} setMessage={setMessage} sendMessage={sendMessage}/>
      </div>
    </div>
    );


};

export default PanelView;
