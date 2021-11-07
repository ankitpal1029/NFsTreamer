"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CreateVoucher = (req, res) => {
    console.log(req.body.data);
    console.log(req.body.data[0].voucher.minPrice);
    let recievedData = req.body.data;
    let insertData = recievedData.map((voucher) => ({
        ipfs: voucher.ipfs,
        voucher: voucher.voucher,
        signature: voucher.signature,
        redeemed: false,
        minPrice: voucher.voucher.minPrice,
    }));
    console.log(insertData);
};
exports.default = CreateVoucher;
//# sourceMappingURL=create-voucher.js.map