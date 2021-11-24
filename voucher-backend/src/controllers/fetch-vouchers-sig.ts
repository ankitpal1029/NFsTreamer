import { Response, Request } from "express";
import Voucher from "../models/voucher";

const FetchVouchersSig = async (req: Request, res: Response) => {
  let recievedData: any = req.query.signature;

  let response;
  try {
    response = await Voucher.findOne({
      signature: recievedData,
    });
  } catch (err) {
    console.log(err);
  }

  return res.json(response);
};

export default FetchVouchersSig;
