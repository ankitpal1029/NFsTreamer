// import axios from "axios";
import { Request, Response } from "express";
// import TwitchUser from "../../models/twitch-users";

const ReturnTwitchUser = async (req: Request, res: Response) => {
  console.log(req.cookies);
  res.send(req.cookies);
};

export default ReturnTwitchUser;
