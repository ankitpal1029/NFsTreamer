import { Request, Response } from "express";
import Voucher from "../models/voucher";

const FetchCurrentId = async (req: Request, res: Response) => {
  let currId;
  try {
    currId = await Voucher.countDocuments({});
  } catch (err) {
    console.log(err);
  }
  console.log(currId);
  return res.json({
    currId: currId,
  });
};

export default FetchCurrentId;
