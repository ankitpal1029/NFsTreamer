import { useState,Component } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import axios from 'axios';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {red} from '@mui/material/colors';

const { expect } = require("chai");
/*
const chai = require("chai");
const { solidity } = require("ethereum-waffle");
chai.use(solidity);
*/
import NFT from "../artifacts/contracts/LazyNFT.sol/LazyNFT.json";    
import { nftaddress, nftmarketaddress } from "../config";


const PORT = 5000;

export class listVouchers extends Component {
  state={
    vouchers: []
  }
  componentDidMount(){
    axios.get('http://localhost:5000/fetchVouchers')
    .then((response)=>{
      console.log(response)
      console.log("hello")
      this.setState({
        vouchers: response.data.allVoucher
      });
    }) 
  }                         
 
  async _redm(voucher,signature){
    console.log("in redeem");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const redeemer = provider.getSigner();
    console.log("signers")                                  

    let contract = new ethers.Contract(nftaddress, NFT.abi, redeemer); 
    //const redeemerFactory = contract.connect(redeemer); 
    
    //const redeemerContract = redeemerFactory.attach(contract.address);
    console.log("signers")
    console.log(redeemer)
    console.log("contract")
    console.log(contract)
    console.log("contract address")
    console.log(contract.getAddress())
    
    //await contract.redeem(redeemer.getAddress(), voucher, signature);
    await contract.fetchNFTsOwned(redeemer.getAddress())
      //const something = await contract.fetchNFTsOwned(redeemer.getAddress());
  //console.log("something", something);

      /*
      .to.emit(contract, "Transfer") // transfer from null address to minter
      .withArgs(
        "0x0000000000000000000000000000000000000000",
        signer.address,
        voucher.tokenId
      )*/
      //.and.to.emit(contract, "Transfer") // transfer from minter to redeemer
      //.withArgs(signer.address, signer.address, voucher.tokenId);



    /*

  let factory = await ethers.getContractFactory("LazyNFT", minter);
  const contract = await factory.deploy(minter.address);

  // the redeemerContract is an instance of the contract that's wired up to the redeemer's signing key
  const redeemerFactory = factory.connect(redeemer);

  const redeemerContract = redeemerFactory.attach(contract.address);
      await expect(redeemerContract.redeem(redeemer.address, voucher, signature))
      .to.emit(contract, "Transfer") // transfer from null address to minter
      .withArgs(
        "0x0000000000000000000000000000000000000000",
        minter.address,
        voucher.tokenId
      )
      .and.to.emit(contract, "Transfer") // transfer from minter to redeemer
      .withArgs(minter.address, redeemer.address, voucher.tokenId);

    */
  }
  
  render() 
  {
    const {vouchers} = this.state
    const vouchList = vouchers.length ? (
      (        
        <div className="flex">
          {
            vouchers.map((v,index)=>{
              console.log("g")
              console.log(v)
              return(
                <div className = "flex-1" style={{padding:"10px"}} key={index}>
                  
                <Card sx={{maxWidth:345}} variant="outlined">
                      <CardHeader
                        title="Banksy"
                        subheader={v.voucher.collection + " collection"}
                      />
                    <CardMedia
                      component="img"
                      height="140"
                      image={"https://ipfs.io/ipfs/"+v.voucher.uri}
                      
                    />
                    <CardContent>
                      Price: {parseInt(v.voucher.minPrice.hex, 16)/Math.pow(10, 18)} ETH
                    </CardContent>
                    <CardContent>
                      Signature: {v.signature}
                    </CardContent>
                    <CardActions>
                    <Button size="small" onClick={()=>this._redm(v.voucher,v.signature)}> 
                      Redeem
                    </Button>
                    
                    </CardActions>
                </Card>
                      </div>
              )
            }
            )
          }
        </div>
      )
    ):(
      <div> No posts!!</div>  
    )
    
    return (
      <div>
        <div>
          
        </div>
        {vouchList}
        </div>
     
    )
  }
}

export default listVouchers
