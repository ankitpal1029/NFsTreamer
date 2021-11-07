"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voucher_1 = __importDefault(require("../models/voucher"));
const CreateVoucher = async (req, res) => {
    let recievedData = req.body.data;
    console.log(typeof recievedData[0].voucher.minPrice);
    let insertData = recievedData.map((x) => ({
        voucher: {
            uri: x.voucher.uri,
            minPrice: x.voucher.minPrice,
            tokenId: x.voucher.tokenId,
        },
        signature: x.signature,
        redeemed: false,
    }));
    console.log(insertData);
    try {
        const response = await voucher_1.default.insertMany(insertData);
        console.log(response);
    }
    catch (err) {
        console.log(err);
    }
};
exports.default = CreateVoucher;
//# sourceMappingURL=create-voucher.js.map