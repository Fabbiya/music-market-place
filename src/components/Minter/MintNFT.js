import React, { useState ,useContext} from "react";
import { Container, Alert, Form,Button,Spinner } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { dropNFTContract, zoraDropCreator, zoraMinter, zoraNFT } from "../../contracts";
import { useMoralis, useWeb3Contract } from "react-moralis";
import Moralis from "moralis";

export default function MintNFT() {
  const [alert, setAlert] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [form, setForm] = useState({});
  const { wallet, isAuth,chain } = useContext(UserContext);
  const { isWeb3Enabled, enableWeb3 } = useMoralis();
  const [isLoading, setIsLoading] = useState(false);
//   const {runContractFunction,isLoading} = useWeb3Contract({
// functionName:"adminMint",
// contractAddress:form.contract,
// abi:dropNFTContract.abi
//   });

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    console.log("value", e.target.value);
  };
  //mint NFT for owner
  const adminMint = async () => {
    if (chain != "0x4" || chain != "0x1") {
      //show error wrong network
    }
    if (!isWeb3Enabled) {
      console.log("enable web3");
      enableWeb3();
    }
    
    console.log("form",form);
    const writeOptions = {
      
      contractAddress: form.contract,
      functionName: "adminMint",
      abi: dropNFTContract.abi,
      params: {
        recipient: form.recipient,
        quantity: parseInt(form.quantity)
      },
    };
    console.log("write options",writeOptions)
    Moralis.executeFunction(writeOptions).then((response) =>{
      console.log("response mint", response);
      setAlert({
        type: "success",
        message: `Your mint was successfull!`,
        title: "NFT Minted",
        link:`https://rinkeby.etherscan.io/tx/${response.hash}`,
        linkText:"View Transaction"
      });
    })
    
  };
  return (
    <Container className="my-5">
      <h2 className="my-0 py-0">Mint NFT</h2>
      <p className="my-0 py-0 text-muted">Powered by Zora</p>
      {showAlert && (
        <Alert
          variant={alert.type}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          <Alert.Heading>{alert.title}</Alert.Heading>
          <p>{alert.message}</p>
          <a href={alert.link} target="_blank">{alert.linkText}</a>
        </Alert>
      )}
      <Form className="my-5">
        <p>Mint your deployed contract </p>
        <Form.Group className="mb-3" controlId="contract">
          <Form.Label> Contract Address</Form.Label>
          <Form.Control
            type="text"
            value={form.contract}
            onChange={handleOnChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="recipient">
          <Form.Label> Mint To</Form.Label>
          <Form.Control
            type="text"
            value={form.recipient}
            onChange={handleOnChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="quantity">
          <Form.Label> Quantity</Form.Label>
          <Form.Control
            type="text"
            value={form.quantity}
            onChange={handleOnChange}
          />
        </Form.Group>
        <Button color="primary" onClick={adminMint}>
              {isLoading ? <Spinner animation="border" /> : "Mint NFT"}
            </Button>
      </Form>
    </Container>
  );
}
