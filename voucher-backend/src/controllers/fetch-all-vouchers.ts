import { Request, Response } from "express";

const FetchAllVouchers = (req: Request, res: Response) => {
  console.log(req);
  return res.json({
    msg: "bitch",
    bro: "sdlfksdf",
  });
};

export default FetchAllVouchers;
