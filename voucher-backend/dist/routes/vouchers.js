"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fetch_all_vouchers_1 = __importDefault(require("../controllers/fetch-all-vouchers"));
const create_voucher_1 = __importDefault(require("../controllers/create-voucher"));
const fetch_current_id_1 = __importDefault(require("../controllers/fetch-current-id"));
const router = express_1.default.Router();
router.get("/fetchVouchers", fetch_all_vouchers_1.default);
router.post("/addVoucher", create_voucher_1.default);
router.get("/getCurrentId", fetch_current_id_1.default);
exports.default = router;
//# sourceMappingURL=vouchers.js.map