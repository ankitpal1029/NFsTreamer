import express from "express";
import FetchAllVouchers from "../controllers/fetch-all-vouchers";
const router = express.Router();

router.get("/fetchVouchers", FetchAllVouchers);
router.post("/addVoucher");

export default router;
