import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema({
  voucher: {
    uri: {
      type: String,
      required: true,
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
    tokenId: {
      type: Number,
      required: true,
      unique: true,
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

export default mongoose.model("Voucher", VoucherSchema);
