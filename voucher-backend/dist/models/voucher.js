"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VoucherSchema = new mongoose_1.default.Schema({
    ipfs: {
        type: String,
        required: true,
    },
    voucher: {
        type: String,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    redeemed: {
        type: Boolean,
        required: true,
    },
    minPrice: {
        required: true,
    },
});
exports.default = mongoose_1.default.model("Voucher", VoucherSchema);
//# sourceMappingURL=voucher.js.map