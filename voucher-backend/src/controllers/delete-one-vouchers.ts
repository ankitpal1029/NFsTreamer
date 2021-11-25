import { Request, Response } from "express";
import Voucher from "../models/voucher";

const DeleteOneVoucher = async (req: Request, res: Response) => {
  try {
    console.log("in deleting one")
    console.log(res)
    console.log(req)
    await Voucher.updateOne( { "voucher.tokenId" : req.body.tokenId }, {$set:{"redeemed":true}} );
  } catch (err) {
    console.log(err);
  }

  res.json({
    msg: "deleted voucher from db",
  });
};

export default DeleteOneVoucher;
