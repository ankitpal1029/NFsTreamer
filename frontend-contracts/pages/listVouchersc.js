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


import NFT from "../artifacts/contracts/LazyNFT.sol/LazyNFT.json";    


const axios = require("axios").default;

class LazyMinter {
  constructor({ contractAddress, signer }) {
    this.contractAddress = contractAddress;
    this.signer = signer;

    this.types = {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      NFTVoucher: [
        { name: "tokenId", type: "uint256" },
        { name: "minPrice", type: "uint256" },
        { name: "uri", type: "string" },
        { name: "amnt", type: "uint256" },
        { name: "collection", type: "string" }
       
      ],
    };
  }

  async _signingDomain() {
    if (this._domain != null) {
      return this._domain;
    }
    const chainId = await this.signer.getChainId();
    this._domain = {
      name: SIGNING_DOMAIN_NAME,
      version: SIGNING_DOMAIN_VERSION,
      verifyingContract: this.contractAddress,
      chainId,
    };
    return this._domain;
  }

  async _formatVoucher(voucher) {
    const domain = await this._signingDomain();
    return {
      domain,
      types: this.types,
      primaryType: "NFTVoucher",
      message: voucher,
    };
  }

  async createVoucher(tokenId, uri, minPrice = 0,amnt,collection) {
    const voucher = { tokenId, minPrice, uri, amnt ,collection};
    const typedData = await this._formatVoucher(voucher);    
    const digest = TypedDataUtils.encodeDigest(typedData);    
    const signature = await this.signer.signMessage(digest); 
    return {
      voucher, 
      signature,
      digest,
    };
  }
}


export default function CreateItem() {

  const [cid, setCid] = useState(null); 
  const[IPFSurl,setIPFSurl] = useState(null); 
  const [file, setFile] = useState(null); 
  const [fileURL, setFileURL] = useState(null); 
  const [formInput, updateFormInput] = useState({ 
    price: "",
    name: "",
    description: "",
  });
  
  const router = useRouter();

  async function onChange(e) {
    console.log('tryna deploy')
    console.log(e.target.files[0]);
    const image = e.target.files[0];
    setFile(image);
    setFileURL(URL.createObjectURL(e.target.files[0]));
  } 

  async function mint() {
    const { name, description, price } = formInput;
    console.log(name)
    if (!name || !description || !price ) return;
    
    try {
      
    console.log('minting');
    const storage = new NFTStorage({ endpoint, token });
    const cid1 = await storage.storeBlob(new Blob([file]));
    setCid(cid1);
    const url = cid1;
    console.log(url);
    //const data = JSON.stringify({name, description, image: "https://ipfs.io/ipfs/"+url})

    //const dataURL = await storage.storeBlob(new Blob([data]));          
    setIPFSurl(url);
    createSale(url);
    
    } catch (error) {
      console.log("Error uploading file: ", error);
    }    
  }
  

  async function createSale(url) {
    console.log("in createSale");
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    console.log("signers")

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);  


    //the redeemerContract is an instance of the contract that's wired up to the redeemer's signing key
    //const redeemerFactory = factory.connect(redeemer);
    //const redeemerContract = redeemerFactory.attach(contract.address);

    console.log("running lazy minter")
    console.log(contract)


    const lazyMinter = new LazyMinter({
      contractAddress: contract.address,
      signer: signer,
    });
    
    //let transaction = await contract.createToken(url);
    const minPrice = ethers.constants.WeiPerEther; 
    const { voucher, signature } = await lazyMinter.createVoucher(
      1,
      url,
      minPrice,
      2,
      "meme"
    );

    console.log("nftadress: "+nftaddress);
    console.log("Created voucher"); 
    let tokenId = voucher.tokenId;  
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    let objToSend = [];
    objToSend.push({
      voucher,
      signature
      //ipfs: "https://ipfs.io/ipfs/bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi",
      //tokenId,
    });



const res = await axios.post("http://localhost:5000/addVoucher", {
        data: objToSend,
      });
      console.log("sent to db!!!")
      console.log(res.data);

      /*
    try {
      const res = await axios.post("http://localhost:5000/addVoucher", {
        data: {
          voucher,
            signature,
            ipfs: url,
            tokenId,
        },
      });
      console.log("sent to db!!!")
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
    */
    /*
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    
    let listingPrice = await contract.getListingPrice();

    
    listingPrice = listingPrice.toString();
    console.log(listingPrice);
    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    
    await transaction.wait();
      */
    /*
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    */
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4" 
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in ETH"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value})
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        <img className="rounded mt-4" width="350" src={fileURL} />
        <button
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
          onClick = {mint}
        >
          MINT !
        </button>
        { IPFSurl && <p>Your IPFS link: {IPFSurl}</p> }
        
       
      </div>
    </div>
  );
}