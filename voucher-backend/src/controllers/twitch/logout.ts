import { Request, Response } from "express";

const LogoutUser = async (req: Request, res: Response) => {
  console.log("called");
  if (req.cookies["TWITCH_ACCESS_TOKEN"]) {
    res.clearCookie("TWITCH_ACCESS_TOKEN");
    res.send({ message: "Logged out" });
  } else {
    res.status(404).send({ error: "Auth Cookie not found" });
  }
};

export default LogoutUser;
