import React, { useContext, useEffect } from "react";
import { useMoralis } from "react-moralis";

import Spinner from 'react-bootstrap/Spinner';
import { Button } from "react-bootstrap";
import logo from './../../assets/logo.png'
import { UserContext } from "../../context/UserContext";

export default function Web3Login() {
  const {
    authenticate,
    isAuthenticated,
    isAuthenticating,
    account,
  } = useMoralis();
 const {wallet,setWallet,isAuth,setIsAuth,chain} = useContext(UserContext);


//  {
//   provider: "web3Auth",
//   clientId:
//   process.env.REACT_APP_WEB3AUTH_CLIENT,
//   chainId:chain,
//   appLogo:logo,
//   theme:"light"
// }

  const login =  () => {
    if (account === null) {
      authenticate()
        .then(function(user) {
          console.log(user.get("ethAddress"));
          setWallet(user.get("ethAddress"))
          setIsAuth(true)
        })
        .catch(function(error) {
          console.log(error);
          setIsAuth(false)
        });
    }
  };

  const { logout } = useMoralis();
  const logOut = async () => {
    await logout();
    console.log("logged out");
    setIsAuth(false);
    setWallet("");
  };

  useEffect(() => {
    // login()
  }, [])
  

  if (isAuth && wallet) {
    return (
      <>
        <Button variant="outline-dark"   onClick={logOut} disabled={isAuthenticating}>
          {wallet.substring(0, 4)} ... {wallet.substring(wallet.length - 4)}
        </Button>

        
      </>
    );
  }

  return (
    <>
      <Button
        onClick={login}
        variant="outline-dark"
        style={{ width: "120px" }}
        
        disabled={isAuthenticating}
      >
        {(isAuthenticating)?(<Spinner animation="border" variant="dark" />):"Login"}
        
      </Button>
    </>
  );
}
