import { useState,useEffect } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";     
import { useRouter } from "next/router";  
import Web3Modal from "web3modal";  
import { NFTStorage, Blob } from 'nft.storage'
const { TypedDataUtils } = require("ethers-eip712");
const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher";
const SIGNING_DOMAIN_VERSION = "1";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/LazyNFT.sol/LazyNFT.json";    
//import Market from "../artifacts/contracts/LazyNFTMarket.sol/LazyNFTMarket.json";     

const endpoint = 'https://api.nft.storage' // the default
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGMyODE0MmI4QTk1ZWU0NzJFQzhFYmZCZmFmYjNBMEJmMTJkODkxOUIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNDczNjgzNTY4OCwibmFtZSI6InRlc3RpbmcifQ.rs8tUWt98e20_8G7vv9evNgtKDEhUNT-Q4pRbTk-ma0' // your API key from https://nft.storage/manage

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


//export default function CreateItem() {
const CreateItem = () => {

  const [cid, setCid] = useState(null);
  const[IPFSurl,setIPFSurl] = useState(null);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [vouchertoken,setVoucherToken] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  
  const router = useRouter();

  async function onChange(e) {
    //console.log('tryna deploy')
    //console.log(e.target.files[0]);
    const image = e.target.files[0];
    setFile(image);
    setFileURL(URL.createObjectURL(e.target.files[0]));
  } 

  async function mint() {
    const { name, description, price } = formInput;
    //console.log(name)
    if (!name || !description || !price ) return;
    
    try {
      
    console.log('minting');
    const storage = new NFTStorage({ endpoint, token });
    const cid1 = await storage.storeBlob(new Blob([file]));
    setCid(cid1);
    const url = cid1;
    //console.log(url);
    //const data = JSON.stringify({name, description, image: "https://ipfs.io/ipfs/"+url})

    //const dataURL = await storage.storeBlob(new Blob([data]));          
    setIPFSurl(url);
    createSale(url,name,description,price);
    
    } catch (error) {
      console.log("Error uploading file: ", error);
    }    
  }

const createSale= async (url,name,desc,price) => {
  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
  });

  const connection = await web3Modal.connect();         
  const provider = new ethers.providers.Web3Provider(connection);         
  const signer = provider.getSigner();
 
  let response = await axios.get("http://localhost:5000/getCurrentId")

  //let contract = new ethers.Contract(nftaddress, NFT.abi, signer);

  console.log(response.data)
  let tokenID = response.data.currId +1;
  console.log(tokenID)

  const lazyMinter = new LazyMinter({
    contractAddress: nftaddress,
    signer: signer,
  });

  //const minPrice = ethers.constants.WeiPerEther; 
  //ethers.BigNumber.from(price)
  const {voucher,signature} = await lazyMinter.createVoucher(
  tokenID,
  "ipfs://"+url,
  ethers.utils.parseEther(price),
  1,
  name
  )

    console.log(voucher,signature)
    let objToSend = [];
    objToSend.push({
      voucher,
      signature
    });


  const res = await axios.post("http://localhost:5000/addVoucher", {
        data: objToSend,
      });
      console.log("sent to db!!!")
      console.log(res.data);

      router.push("/");
  }

  return (
    <div className="flex justify-center">
      {vouchertoken}
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

export default CreateItem;
