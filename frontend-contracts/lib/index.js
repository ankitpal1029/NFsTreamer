const ethers = require("ethers");


const { TypedDataUtils } = require("ethers-eip712");

//const { NFTStorage, Blob } = require('nft.storage');

//import { NFTStorage,Blob } from 'nft.storage/dist/bundle.esm.min.js'

//import NFTStorage from 'nft.storage/dist/bundle.esm.min.js';

const {
  NFTStorage, 
  Blob,
} = require("https://cdn.jsdelivr.net/npm/nft.storage@v5.1.3/dist/bundle.esm.min.js");



const endpoint = 'https://api.nft.storage';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGMyODE0MmI4QTk1ZWU0NzJFQzhFYmZCZmFmYjNBMEJmMTJkODkxOUIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzNDczNjgzNTY4OCwibmFtZSI6InRlc3RpbmcifQ.rs8tUWt98e20_8G7vv9evNgtKDEhUNT-Q4pRbTk-ma0';

const SIGNING_DOMAIN_NAME = "LazyNFT-Voucher";
const SIGNING_DOMAIN_VERSION = "1";

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

      /*
      NFTVoucher: [
        { name: "tokenId", type: "uint256" },
        { name: "minPrice", type: "uint256" },
        { name: "uri", type: "string" },
        { name: "collection", type: "string" },
      ],
      */
     
      NFTCID: [
        { name: "v_url", type: "string" }
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

  async _formatVoucher(vouch) {
    const domain = await this._signingDomain();
    return {
      domain, 
      types: this.types, 
      primaryType: "NFTCID",  
      message: vouch, 
    };
  }

  async createVoucher(tokenId, uri, minPrice = 0, tier, collection) {
    const voucher = { tokenId, minPrice, uri,tier, collection };
    
    const voucher_json = {
      "name": collection, 
      "tokenId":tokenId, 
      "minPrice":minPrice, 
      "image": uri,
      "tier": tier
    };
    
    
    //console.log("json contents");
    //console.log(collection,tokenId,minPrice,uri);
    
    const storage = new NFTStorage({ endpoint, token });
    const metadata = new Blob([JSON.stringify(voucher_json)], { type: 'application/json' });

    const v_url = await storage.storeBlob(new Blob([metadata]));


    const meta = {v_url};

    const typedData = await this._formatVoucher(meta);

    const digest = TypedDataUtils.encodeDigest(typedData);

    const signature = await this.signer.signMessage(digest);
    /*
    console.log("===============================");
    console.log("typedData:", typedData);
    console.log("digest:", digest);
    console.log("signature:", signature);
    console.log("==========================");
    */
    return {
      voucher,
      meta,
      signature,
      digest
    };
  }
}

module.exports = {
  LazyMinter
};
