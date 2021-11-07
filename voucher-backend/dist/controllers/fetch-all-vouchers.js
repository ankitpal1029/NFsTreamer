"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voucher_1 = __importDefault(require("../models/voucher"));
const FetchAllVouchers = async (req, res) => {
    let allVoucher;
    try {
        allVoucher = await voucher_1.default.find({});
    }
    catch (err) {
        console.log(err);
    }
    return res.json({
        allVoucher,
    });
};
exports.default = FetchAllVouchers;
//# sourceMappingURL=fetch-all-vouchers.js.map