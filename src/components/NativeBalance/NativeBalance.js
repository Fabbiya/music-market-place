import React, { useEffect, useState } from "react";
import {  useNativeBalance } from "react-moralis";
export default function NativeBalance(props) {
  const[nativeBalance,setNativeBalance]=useState("");
  
  
  const {
    getBalances
  } = useNativeBalance({ chain: "0x89",address:props.wallet});
  useEffect(()=>{
    if(props.wallet){
      getBalances({onSuccess:(res)=>{
        var b = Number(res.balance) / Math.pow(10,18);
        console.log("res",b);
        
        setNativeBalance(`${b.toFixed(3)} MATIC`);
      }});
      
    }
    
  },[getBalances,nativeBalance,props])
  
  return (
    <div >
      <span >{nativeBalance}</span>
    </div>
  );
  
}
