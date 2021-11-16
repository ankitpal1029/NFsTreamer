import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import "./panel.html.css";
import InfoBar from "../components/panel/infobar/infobar";
import Input from "../components/panel/input/input";
import Messages from "../components/panel/messages/messages";

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

const PanelView: React.FC = () => {
  const room = "something";
  const [userId, setUserId] = useState("not on twitch");
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<IMessageFormat[]>([]);
  const ENDPOINT = "http://localhost:5000";

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

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={userId} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default PanelView;
