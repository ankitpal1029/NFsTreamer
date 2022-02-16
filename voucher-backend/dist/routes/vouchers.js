"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fetch_all_vouchers_1 = __importDefault(require("../controllers/vouchers/fetch-all-vouchers"));
const create_voucher_1 = __importDefault(require("../controllers/vouchers/create-voucher"));
const fetch_current_id_1 = __importDefault(require("../controllers/vouchers/fetch-current-id"));
const delete_all_vouchers_1 = __importDefault(require("../controllers/vouchers/delete-all-vouchers"));
const delete_one_vouchers_1 = __importDefault(require("../controllers/vouchers/delete-one-vouchers"));
const fetch_vouchers_sig_1 = __importDefault(require("../controllers/vouchers/fetch-vouchers-sig"));
const router = express_1.default.Router();
router.get("/fetchVouchers", fetch_all_vouchers_1.default);
router.post("/addVoucher", create_voucher_1.default);
router.get("/getCurrentId", fetch_current_id_1.default);
router.post("/deleteAll", delete_all_vouchers_1.default);
router.post("/deleteOne", delete_one_vouchers_1.default);
router.post("/fetchSig", fetch_vouchers_sig_1.default);
exports.default = router;
//# sourceMappingURL=vouchers.js.map