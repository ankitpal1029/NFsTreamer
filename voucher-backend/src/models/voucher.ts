import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema({
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

  },
  meta:{ v_url:{
    type:String,
    required:true,
  }
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

    /*
    
    */