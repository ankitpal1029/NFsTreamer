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

const dbURI="mongodb+srv://shri:shri@cluster0.qkphc.mongodb.net/voucher-db";

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
                    <Button size="small" > 
                      Buy
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
