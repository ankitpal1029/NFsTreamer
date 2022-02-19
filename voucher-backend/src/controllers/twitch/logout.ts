import { Request, Response } from "express";

const LogoutUser = async (req: Request, res: Response) => {
  if(req.cookies['TWITCH_ACCESS_TOKEN']){
    res.clearCookie('TWITCH_ACCESS_TOKEN');
  }else{
    res.status(404).send({error: "Auth Cookie not found"});
  }

};

export default LogoutUser;
