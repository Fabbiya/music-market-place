import React, { createContext, useState } from "react";

export const UserContext = createContext(null);

export const UserProvider = (props) => {
    const [wallet, setWallet] = useState(null);
    const [chain, setChain] = useState(null);
    const [connector, setConnector] = useState(null);
    const [connectorId, setConnectorId] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
  
    return (
      <UserContext.Provider
        value={{
          wallet,
          setWallet,
          chain,
          setChain,
          connector,
          setConnector,
          connectorId,
          setConnectorId,
          isAuth,
          setIsAuth,
        }}
      >
        {props.children}
      </UserContext.Provider>
    );
  };