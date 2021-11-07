import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema({
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

export default mongoose.model("Voucher", VoucherSchema);
