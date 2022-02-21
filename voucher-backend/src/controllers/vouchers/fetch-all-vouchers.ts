import { Request, Response } from "express";
import Voucher from "../../models/voucher";

const FetchAllVouchers = async (_: Request, res: Response) => {
  let allVoucher;
  //console.log(req);
  try {
    allVoucher = await Voucher.find({});
  } catch (err) {
    console.log(err);
  }

  return res.json({
    allVoucher,
  });
};

export default FetchAllVouchers;
