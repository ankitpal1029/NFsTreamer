import {
  contract as contract_prod,
  deployer as deployer_prod,
} from "../config.js";
import {
  contract as contract_dev,
  deployer as deployer_dev,
} from "../config_local";

export const contract =
  process.env.NODE_ENV === "development" ? contract_dev : contract_prod;

export const deployer =
  process.env.NODE_ENV === "development" ? deployer_dev : deployer_prod;
