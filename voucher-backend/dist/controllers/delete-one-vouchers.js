"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voucher_1 = __importDefault(require("../models/voucher"));
const DeleteOneVoucher = async (req, res) => {
    try {
        console.log("in deleting one");
        console.log(res);
        console.log(req);
        await voucher_1.default.updateOne({ "voucher.tokenId": req.body.tokenId }, { $set: { "redeemed": true } });
    }
    catch (err) {
        console.log(err);
    }
    res.json({
        msg: "deleted voucher from db",
    });
};
exports.default = DeleteOneVoucher;
//# sourceMappingURL=delete-one-vouchers.js.map