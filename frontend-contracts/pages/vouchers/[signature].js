import { useRouter } from "next/router";
import { useState, Component, useEffect } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import CardHeader from "@mui/material/CardHeader";

import NFT from "../../artifacts/contracts/LazyNFT.sol/LazyNFT.json";
import { nftaddress } from "../../newconfig";

const singleVoucher = () => {
  const router = useRouter();
  const { signature } = router.query;
  console.log(signature);

  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    console.log("gonna fetch!!!");
    axios
      .post("http://localhost:5000/fetchSig", {
        signature: router.query.signature,
      })
      .then((response) => {
        console.log(response);
        setVouchers([response.data]);
      });
  }, [router.query]);

  const _redm = async (voucher, signature) => {
    console.log("redeem");
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const lazynftContract = new ethers.Contract(nftaddress, NFT.abi, signer);

    try {
      const res = await lazynftContract.redeem(
        signer.getAddress(),
        voucher,
        signature,
        {
          value: voucher.minPrice,
        }
      );
      console.log(res);
      try {
        console.log("tryna delete");
        await axios
          .post("http://localhost:5000/deleteOne", { tokenId: voucher.tokenId })
          .then((res) => {
            console.log(res.data);
          });
      } catch (err) {
        console.log("delete one not working", err);
      }
    } catch (err) {
      console.log("redeem not working", err);
    }

    //console.log("nfts owned")
    //const nftsOwned = await lazynftContract.fetchNFTsOwned(signer.getAddress());
    //console.log(nftsOwned);
  };

  return (
    <div className="m-4">
      {vouchers.length != 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {vouchers.map((v, index) => {
            console.log("v", v);
            if (v && v.redeemed == false) {
              return (
                <div
                  className=""
                  //style={{ padding: "10px" }}
                  key={index}
                >
                  <Card sx={{ maxWidth: 345 }} variant="outlined">
                    <CardHeader
                      title="Banksy"
                      subheader={v.voucher.collection + " collection"}
                    />
                    <CardMedia
                      component="img"
                      height="140"
                      //image={"https://ipfs.io/ipfs/" + v.voucher.uri}
                      image={
                        "https://ipfs.io/ipfs/" + v.voucher.uri.split("//")[1]
                      }
                    />

                    <CardContent>
                      Price:{" "}
                      {parseInt(v.voucher.minPrice.hex, 16) / Math.pow(10, 18)}{" "}
                      ETH
                    </CardContent>
                    <CardContent>Signature: {v.signature}</CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        onClick={() => _redm(v.voucher, v.signature)}
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
        <div> No posts!!</div>
      )}
    </div>
  );

  //return(<p>signature</p>);
};

export default singleVoucher;
