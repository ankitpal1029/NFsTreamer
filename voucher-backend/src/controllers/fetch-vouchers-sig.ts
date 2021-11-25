import { Response, Request } from "express";
import Voucher from "../models/voucher";

const FetchVouchersSig = async (req: Request, res: Response) => {
  let recievedData: any = req.query.signature;

  let response;
  try {
    console.log("received",recievedData)
    response = await Voucher.findOne({    
      "voucher.signature": recievedData,            
    });
  } catch (err) {
    console.log(err);
  }

  return res.json(response);
};

export default FetchVouchersSig;
