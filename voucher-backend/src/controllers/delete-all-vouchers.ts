import { Request, Response } from "express";
import Voucher from "../models/voucher";

const DeleteAllVouchers = async (req: Request, res: Response) => {
  try {
    await Voucher.deleteMany();
  } catch (err) {
    console.log(err);
  }

  res.json({
    msg: "deleted all vouchers from db",
  });
};

export default DeleteAllVouchers;
