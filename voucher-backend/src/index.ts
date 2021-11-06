import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import voucherRoutes from "./routes/vouchers";

require("dotenv").config();

const main = async () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  const { PORT, DB_CONNECTION } = process.env;

  //connect to db
  mongoose.connect(`${DB_CONNECTION}`, () => {
    console.log(`connected to db`);
  });

  app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });

  app.use(voucherRoutes);
};

main().catch((err) => {
  console.log(err);
});
