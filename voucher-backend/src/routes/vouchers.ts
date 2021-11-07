import express from "express";
import FetchAllVouchers from "../controllers/fetch-all-vouchers";
import CreateVoucher from "../controllers/create-voucher";
const router = express.Router();

router.get("/fetchVouchers", FetchAllVouchers);
router.post("/addVoucher", CreateVoucher);

export default router;
