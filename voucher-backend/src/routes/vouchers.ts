import express from "express";
import FetchAllVouchers from "../controllers/fetch-all-vouchers";
import CreateVoucher from "../controllers/create-voucher";
import FetchCurrentId from "../controllers/fetch-current-id";
import DeleteAllVouchers from "../controllers/delete-all-vouchers";
import DeleteOneVoucher from "../controllers/delete-one-vouchers";

const router = express.Router();

router.get("/fetchVouchers", FetchAllVouchers);
router.post("/addVoucher", CreateVoucher);
router.get("/getCurrentId", FetchCurrentId);
router.post("/deleteAll", DeleteAllVouchers);
router.post("/deleteOne", DeleteOneVoucher);


export default router;
