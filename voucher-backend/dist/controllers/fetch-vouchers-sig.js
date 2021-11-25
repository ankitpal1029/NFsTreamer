"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voucher_1 = __importDefault(require("../models/voucher"));
const FetchVouchersSig = async (req, res) => {
    let recievedData = req.query.signature;
    let response;
    try {
        console.log("received", recievedData);
        response = await voucher_1.default.findOne({
            "voucher.signature": recievedData,
        });
    }
    catch (err) {
        console.log(err);
    }
    return res.json(response);
};
exports.default = FetchVouchersSig;
//# sourceMappingURL=fetch-vouchers-sig.js.map