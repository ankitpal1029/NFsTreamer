import { Request, Response } from "express";
import Voucher from "../models/voucher";

interface IvoucherAPIData {
  voucher: {
    uri: String;
    minPrice: {
      type: String;
      hex: String;
    };
    tokenId: Number;
  };
  signature: String;
  ipfs: String;
  tokenId: Number;
}
const CreateVoucher = (req: Request, res: Response) => {
  console.log(req.body.data);
  console.log(req.body.data[0].voucher.minPrice);

  let recievedData: IvoucherAPIData[] = req.body.data;
  let insertData = recievedData.map((voucher: IvoucherAPIData) => ({
    ipfs: voucher.ipfs,
    voucher: voucher.voucher,
    signature: voucher.signature,
    redeemed: false,
    minPrice: voucher.voucher.minPrice,
  }));
  console.log(insertData);
};

export default CreateVoucher;
