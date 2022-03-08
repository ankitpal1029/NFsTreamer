import { Request, Response } from "express";
import axios from "axios";
import TwitchUser from "../../models/twitch-users";
import { CLIENT_ID } from "../../lib/constants";

const AddWalletAddress = async (req: Request, res: Response) => {
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

      const response = await TwitchUser.findOneAndUpdate(
        { id: req.body.id },
        { wallet_address: req.body.wallet_address }
      );
      console.log(response);
      res.send({ message: "updated wallet address" });
    } catch (error) {
      console.log(error);
      res.send({ message: error });
    }
  }
  return res.send();
};

export default AddWalletAddress;
