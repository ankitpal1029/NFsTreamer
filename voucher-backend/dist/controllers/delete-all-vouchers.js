"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voucher_1 = __importDefault(require("../models/voucher"));
const DeleteAllVouchers = async (req, res) => {
    try {
        await voucher_1.default.deleteMany();
    }
    catch (err) {
        console.log(err);
    }
    res.json({
        msg: "deleted all vouchers from db",
    });
};
exports.default = DeleteAllVouchers;
//# sourceMappingURL=delete-all-vouchers.js.map