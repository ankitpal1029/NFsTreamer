import express from "express";
import FetchAllVouchers from "../controllers/fetch-all-vouchers";
import CreateVoucher from "../controllers/create-voucher";
import FetchCurrentId from "../controllers/fetch-current-id";
<<<<<<< HEAD
import FetchVouchersSig from "../controllers/fetch-vouchers-sig";
=======
import DeleteAllVouchers from "../controllers/delete-all-vouchers";
>>>>>>> 28ba638ecebff0dc42b5b487ac440957c7cfa5bf
const router = express.Router();

router.get("/fetchVouchers", FetchAllVouchers);
router.post("/addVoucher", CreateVoucher);
router.get("/getCurrentId", FetchCurrentId);
<<<<<<< HEAD
router.get("/fetchVouchersSig", FetchVouchersSig);
=======
router.post("/deleteAll", DeleteAllVouchers);
>>>>>>> 28ba638ecebff0dc42b5b487ac440957c7cfa5bf

export default router;
