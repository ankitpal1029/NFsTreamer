import express from "express";
import FetchAllVouchers from "../controllers/vouchers/fetch-all-vouchers";
import CreateVoucher from "../controllers/vouchers/create-voucher";
import FetchCurrentId from "../controllers/vouchers/fetch-current-id";
import DeleteAllVouchers from "../controllers/vouchers/delete-all-vouchers";
import DeleteOneVoucher from "../controllers/vouchers/delete-one-vouchers";
import FetchVouchersSig from "../controllers/vouchers/fetch-vouchers-sig";

const router = express.Router();

router.get("/fetchVouchers", FetchAllVouchers);
router.post("/addVoucher", CreateVoucher);
router.get("/getCurrentId", FetchCurrentId);
router.post("/deleteAll", DeleteAllVouchers);
router.post("/deleteOne", DeleteOneVoucher);
router.post("/fetchSig", FetchVouchersSig);

export default router;
