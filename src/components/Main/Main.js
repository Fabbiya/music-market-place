import React,{useEffect} from "react";
import { Button, Container } from "react-bootstrap";
import bg from "./../../assets/bg-main.jpg";
import "./main.css";


export default function Main() {
  
  
  return (
    <div style={{backgroundImage: `url(${bg}) `, backgroundPosition:"center", height:"100vh", backgroundRepeat:"no-repeat", backgroundSize:"cover", width:"100vw"}}  >
      <div className="center-text">
        <p>Aqua Metaverse Presents</p>
        <h1><b>NFT Market Place For <br/><span className="text-warning">Audio & video Arts</span></b></h1>
       
      </div>
    </div>
  );
}
