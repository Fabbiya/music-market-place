import React, { createContext, useState } from "react";

export const NFTContext = createContext(null);

export const NFTProvider = (props) => {
    const [nft, setNft] = useState({});
  
    return (
      <NFTContext.Provider
        value={{
          nft,
          setNft
        }}
      >
        {props.children}
      </NFTContext.Provider>
    );
  };