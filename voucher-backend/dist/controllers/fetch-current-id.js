"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const voucher_1 = __importDefault(require("../models/voucher"));
const FetchCurrentId = async (req, res) => {
    let currId;
    try {
        currId = await voucher_1.default.countDocuments({});
    }
    catch (err) {
        console.log(err);
    }
    console.log(currId);
    return res.json({
        currId: currId,
    });
};
exports.default = FetchCurrentId;
//# sourceMappingURL=fetch-current-id.js.map