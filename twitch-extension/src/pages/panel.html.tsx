import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

declare global {
  interface Window {
    Twitch: any;
  }
}

let socket: any;

const PanelView: React.FC = () => {
  const roomName = "something";
  const [userId, setUserId] = useState("");
  const ENDPOINT = "http://localhost:5000";

  useEffect(() => {
    if (window.Twitch) {
      window.Twitch.ext.onAuthorized(function (auth: any) {
        window.Twitch.ext.rig.log(auth.userId);
        window.Twitch.ext.rig.log(io);
        console.log("bitch");

        setUserId(auth.userId);

        //window.Twitch.ext.rig.log("socket data", socket);
      });
    } else {
      console.log("you're not on twitch or twitch rig");
    }

    const socket = io(ENDPOINT);
    console.log(socket);
    //console.log("socket data", socket);
  });
  return <h1>Chat</h1>;
};

export default PanelView;
