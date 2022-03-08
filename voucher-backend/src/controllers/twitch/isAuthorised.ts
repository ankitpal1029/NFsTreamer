import { Request, Response } from "express";
import axios from "axios";
import { CLIENT_ID } from "../../lib/constants";

const isAuthorised = async (req: Request, res: Response) => {
  if (!req.cookies["TWITCH_ACCESS_TOKEN"]) {
    // cookie isn't there so generate a new one
    res.send({ error: "Cookie not found" });
  } else {
    const access_token = req.cookies["TWITCH_ACCESS_TOKEN"];
    try {
      await axios.get("https://id.twitch.tv/oauth2/validate", {
        headers: {
          "Client-ID": CLIENT_ID as string,
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
