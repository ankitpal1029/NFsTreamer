import { useState, Component, useEffect } from "react";
import React from 'react';
import ReactDOM from 'react-dom';

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Card from "@mui/material/Card"; 
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";

// component imports
import Navbar from "../components/navbar";
import withAuth from "../components/HOC/withAuth";

import LazyNFT from "../artifacts/contracts/LazyNFT.sol/LazyNFT.json";
import axios from "../lib/axios_config";
import { contract, deployer } from "../lib/config";

// redux imports
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/auth/authSlice.js";

const ListVouchers = () => {
  const dispatch = useDispatch();
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    dispatch(login());
    axios.get("/fetchVouchers").then((response) => {
      setVouchers(response.data.allVoucher);
    });
  }, []);

  const _redm = async (voucher, meta, signature) => {
    console.log("redeem");
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const lazynftContract = new ethers.Contract(contract, LazyNFT.abi, signer);

    try {
      const res = await lazynftContract.redeem(
        signer.getAddress(),
        voucher,
        meta,
        signature,
        {
          value: voucher.minPrice,
        }
      );
      console.log("redeeming!!!!!")
      console.log(res);

      try {
        console.log("tryna delete");
        await axios
          .post("/deleteOne", {
            tokenId: voucher.tokenId,
          })
          .then((res) => {
            console.log(res.data);
          });
      } catch (err) {
        console.log("delete one not working", err);
      }
    } catch (err) {
      console.log("redeem not working", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="m-4">
        {vouchers.length ? (
          <div className="grid grid-cols-3 gap-4">
            {vouchers.map((v, index) => {
              if (!v.redeemed) {
                return (
                  <div className="" key={index}>
                    <Card sx={{ maxWidth: 345 }} variant="outlined">
                      <CardHeader
                        //title="Banksy"
                        title={v.voucher.collection + " collection"}
                        subheader={"Tier "+v.voucher.tier}
                      />
                      <CardMedia
                        component="img"
                        height="140"
                        image={
                          "https://ipfs.io/ipfs/" + v.voucher.uri.split("//")[1]
                        }
                      />

                      <CardContent>
                        Price:{" "}
                        {parseInt(v.voucher.minPrice.hex, 16) /
                          Math.pow(10, 18)}{" "}
                        ETH
                      </CardContent>
                      <CardContent>Signature: {v.signature}</CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => _redm(v.voucher, v.meta, v.signature)}
                        >
                          Redeem
                        </Button>
                      </CardActions>
                    </Card>
                  </div>
                );
              }
            })}
          </div>
        ) : (
          <div> No Vouchers!!</div>
        )}
      </div>
    </>
  );
};

export default withAuth(ListVouchers);
