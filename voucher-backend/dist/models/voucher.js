"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const VoucherSchema = new mongoose_1.default.Schema({
    voucher: {
        tokenId: {
            type: Number,
            required: true,
            unique: true,
        },
        minPrice: {
            type: {
                type: String,
                required: true,
            },
            hex: {
                type: String,
                required: true,
            },
        },
        uri: {
            type: String,
            required: true,
        },
        collection: {
            type: String,
            required: true,
        },
        tier: {
            type: Number,
            required: true,
        },
    },
    meta: {
        v_url: {
            type: String,
            required: true,
        },
    },
    signature: {
        type: String,
        required: true,
    },
    redeemed: {
        type: Boolean,
        required: true,
    },
});
exports.default = mongoose_1.default.model("Voucher", VoucherSchema);
//# sourceMappingURL=voucher.js.map