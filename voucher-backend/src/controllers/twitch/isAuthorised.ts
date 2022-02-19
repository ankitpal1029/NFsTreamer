import { Request, Response } from "express";
import axios from "axios";

const isAuthorised = async (req: Request, res: Response) => {
  if (!req.cookies["TWITCH_ACCESS_TOKEN"]) {
    // cookie isn't there so generate a new one
    console.log("this is happening");
    res.send({ error: "Cookie not found" });
  } else {
    const clientID = "j1ixdsvzh5g4uqj1a2p7lydufww406";
    const access_token = req.cookies["TWITCH_ACCESS_TOKEN"];
    try {
      await axios.get("https://id.twitch.tv/oauth2/validate", {
        headers: {
          "Client-ID": clientID,
          Authorization: "Bearer " + access_token,
        },
      });

      res.send({ message: "valid access token" });
    } catch (error) {
      res.send({ message: error.response.data.message });
    }
  }
};

export default isAuthorised;
