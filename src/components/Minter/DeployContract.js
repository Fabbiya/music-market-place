import React, { useState, useContext, useEffect } from "react";
import {
  Container,
  Form,
  Alert,
  Row,
  Col,
  Tab,
  Tabs,
  Button,
  Spinner,
  Card,
} from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { NFTContext } from "../../context/NFTContext";
import { StepContext } from "../../context/StepContext";
import Moralis from "moralis";
import { zoraDropCreator, zoraMinter, zoraNFT } from "../../contracts";
import { useMoralis } from "react-moralis";
import { generateSHA256FileHash } from "../../utils/hash";
import { utils } from "ethers"
import { useContractWrite, useSwitchNetwork, useNetwork, useConnect } from "wagmi"
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function DeployContract() {
  const [form, setForm] = useState({});
  const [alert, setAlert] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { nft, setNft } = useContext(NFTContext);
  const { wallet, isAuth,chain } = useContext(UserContext);
  const { step, setStep } = useContext(StepContext);
  const { isWeb3Enabled, enableWeb3 } = useMoralis();
  const [isOpenEdition,setIsOpenEdition] = useState(false);


  useEffect(() => {
    getMeta();
  }, []);

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    console.log("value", e.target.value);
    if (e.target.id==="edition") {
      if (e.target.value === "Open Edition") {
        setIsOpenEdition(true)
      }
      else{
        setIsOpenEdition(false)
      }
    }
  };
  const dealWithEther = (price) => {
    if (price === "") {
      return 0
    }
    return utils.parseEther(price)
  }
  const getMeta = async () => {
    const params = { theUrl: `https://ipfs.io/ipfs/${nft.CID}/metadata.json` };
    const metadata = await Moralis.Cloud.run("fetchJson", params);
    console.log("metadata", metadata);
    setForm({
      ...form,
      name: metadata.data.name,
      description: metadata.data.description,
      author: metadata.data.author,
      collection: metadata.data.collection,
    });
  };
  //const { isWeb3Enabled, enableWeb3 } = useMoralis();
  const mintNFTDrop = async () => {
    if (chain != "0x4" || chain != "0x1") {
      //show error wrong network
    }
    if (!isWeb3Enabled) {
      console.log("enable web3");
      enableWeb3();
    }
    
    console.log("form",form);
    const writeOptions = {
      
      contractAddress: (chain==="0x4")? zoraDropCreator[4] : zoraDropCreator[1],
      functionName: "createDrop",
      abi: zoraDropCreator.abi,
      params: {
        name: form.name,
        symbol: form.symbol,
        defaultAdmin: wallet,
        fundsRecipient: wallet,
        editionSize: form.editionSize,
        royaltyBPS: form.royalty * 100,
        saleConfig:[
          dealWithEther(form.price),
          form.mintCapPerWallet,
          Math.floor(new Date(form.publicStartTime).getTime() / 1000),
          Math.floor(new Date(form.publicEndTime).getTime() / 1000),
          Math.floor(new Date(form.presaleStartTime).getTime() / 1000),
          Math.floor(new Date(form.presaleEndTime).getTime() / 1000),
          form.merkleRoot
        ]
        ,
        metadataURIBase:`ipfs://${nft.CID}/${nft.file.name}`,
        metadataContractURI:form.metadataContractUri,
      },
    };
    console.log("write options",writeOptions)
    Moralis.executeFunction(writeOptions).then((response) =>{
      console.log("response Drop", response);
      setAlert({
        type: "success",
        message: `YAY! Your Contract deployed successfully!`,
        title: "Contract Deployed",
        link:`https://rinkeby.etherscan.io/tx/${response.hash}`,
        linkText:"View Transaction"
      });
      setShowAlert(true)
    })
    
  };

  const mintNFTEdition = async()=>{
    if (chain != "0x4" || chain != "0x1") {
      //show error wrong network
    }
    if (!isWeb3Enabled) {
      console.log("enable web3");
      enableWeb3();
    }
    

    const writeOptions = {
      contractAddress: (chain==="0x4")? zoraDropCreator[4] : zoraDropCreator[1],
      functionName: "createEdition",
      abi: zoraDropCreator.abi,
      params: {
        name: form.name,
        symbol: form.symbol,
        editionSize: form.editionSize,
        defaultAdmin: wallet,
        fundsRecipient: wallet,
        royaltyBPS: form.royalty * 100,
        saleConfig:[
          dealWithEther(form.price),
          form.mintCapPerWallet,
          Math.floor(new Date(form.publicStartTime).getTime() / 1000),
          Math.floor(new Date(form.publicEndTime).getTime() / 1000),
          Math.floor(new Date(form.presaleStartTime).getTime() / 1000),
          Math.floor(new Date(form.presaleEndTime).getTime() / 1000),
          
          form.merkleRoot
        ],
        description:form.description,
        animationURI:`ipfs://${nft.CID}/${nft.file.name}`,
        imageURI:`ipfs://${nft.CID}/${nft.cover.name}`,
      },
    };
    Moralis.executeFunction(writeOptions).then((response) =>{
      console.log("responseEdition", response);
      setAlert({
        type: "success",
        message: `YAY! Your Contract deployed successfully!`,
        title: "Contract Deployed",
        link:`https://rinkeby.etherscan.io/tx/${response.hash}`,
        linkText:"View Transaction"
      });
      setShowAlert(true)
    })
  }

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

      <Tabs
      defaultActiveKey="profile"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="drop" title="Drop Creation">
      <Row>
        <Col lg={6}>
          <Form className="my-5">
            <p>
              Please fill the details to deploy your NFT and add it to marketplace
            </p>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label> Name</Form.Label>
              <Form.Control type="text"  value={form.name} onChange={handleOnChange}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="symbol">
              <Form.Label> Symbol</Form.Label>
              <Form.Control
                type="text"
                placeholder="Symbol $SYB"
                onChange={handleOnChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label> Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description"
                onChange={handleOnChange}
                value={form.description}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="price">
              <Form.Label> Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="0.01"
                onChange={handleOnChange}
              />
            </Form.Group>

            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3" >
                  <Form.Label> Edition Size</Form.Label>

                  <div>
                    <select
                      id="edition"
                      onChange={handleOnChange}
                      className="dropdown-toggle btn btn-success"
                    >
                      <option value="Open Edition">Open Edition</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="editionSize">
                  <Form.Label> Edition</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="10"
                    onChange={handleOnChange}
                    disabled={isOpenEdition}
                  />
                </Form.Group>
              </Col>
            </Row>
            <p>Presale Details</p>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="presaleStartTime">
                  <Form.Label> Start Time (Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder={new Date().toDateString()}
                    onChange={handleOnChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="presaleEndTime">
                  <Form.Label> End Time(Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder={new Date().toDateString()}
                    onChange={handleOnChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <p>Public sale Details</p>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="publicStartTime">
                  <Form.Label> Start Time (Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder={new Date().toDateString()}
                    onChange={handleOnChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="publicEndTime">
                  <Form.Label> End Time(Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder={new Date().toDateString()}
                    onChange={handleOnChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="royalty">
              <Form.Label> Royalty (%)</Form.Label>
              <Form.Control
                type="text"
                placeholder="10"
                onChange={handleOnChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="mintCapPerWallet">
              <Form.Label> Mint Cap Per Wallet</Form.Label>
              <Form.Control
                type="text"
                placeholder="2"
                onChange={handleOnChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="payout">
              <Form.Label> Payout address</Form.Label>
              <p><small>This is the address which payouts will be transfered to</small></p>
              <Form.Control
                type="text"
                placeholder="0x987654..."
                onChange={handleOnChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="merkleRoot">
                  <Form.Label>Presale Merkle root</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={new Date().toDateString()}
                    onChange={handleOnChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="metadataUriBase">
                  <Form.Label>Metadata URI Base</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Metadata URI Base"
                    onChange={handleOnChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="metadataContractUri">
                  <Form.Label>Metadata Contract URI</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Metadata Contract URI"
                    onChange={handleOnChange}
                  />
                </Form.Group>
            <Button color="primary" onClick={mintNFTDrop}>
              {isLoading ? <Spinner animation="border" /> : "Deploy Drop"}
            </Button>
          </Form>
        </Col>
        <Col lg={6}>
          <Card className="mb-2">
            <Card.Body>
              <img
                src={`https://nftstorage.link/ipfs/${nft.CID}/${nft.cover.name}`}
                className="w-100"
              />
            </Card.Body>
          </Card>
          <Card className="mt-2">
            <Card.Body>
              <object
                data={`https://nftstorage.link/ipfs/${nft.CID}/${nft.file.name}`}
                className="w-100"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Tab>
      <Tab eventKey="edition" title="Edition Creation">
      <Row>
        <Col lg={6}>
          <Form className="my-5">
            <p>
              Please fill the details to mint your NFT and add it to marketplace
            </p>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label> Name</Form.Label>
              <Form.Control type="text"  value={form.name} onChange={handleOnChange}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="symbol">
              <Form.Label> Symbol</Form.Label>
              <Form.Control
                type="text"
                placeholder="Symbol $SYB"
                onChange={handleOnChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label> Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description"
                onChange={handleOnChange}
                value={form.description}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="price">
              <Form.Label> Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="0.01"
                onChange={handleOnChange}
              />
            </Form.Group>

            <Row>
              <Col lg={6}>
                <Form.Group className="mb-3" >
                  <Form.Label> Edition Size</Form.Label>

                  <div>
                    <select
                      id="edition"
                      onChange={handleOnChange}
                      className="dropdown-toggle btn btn-success"
                    >
                      <option value="Open Edition">Open Edition</option>
                      <option value="Fixed">Fixed</option>
                    </select>
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="mb-3" controlId="editionSize">
                  <Form.Label> Edition</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="10"
                    onChange={handleOnChange}
                    disabled={isOpenEdition}
                  />
                </Form.Group>
              </Col>
            </Row>
            <p>Presale Details</p>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="presaleStartTime">
                  <Form.Label> Start Time (Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder={new Date().toDateString()}
                    onChange={handleOnChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="presaleEndTime">
                  <Form.Label> End Time(Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder={new Date().toDateString()}
                    onChange={handleOnChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <p>Public sale Details</p>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="publicStartTime">
                  <Form.Label> Start Time (Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder={new Date().toDateString()}
                    onChange={handleOnChange}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="publicEndTime">
                  <Form.Label> End Time(Optional)</Form.Label>
                  <Form.Control
                    type="date"
                    placeholder={new Date().toDateString()}
                    onChange={handleOnChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="royalty">
              <Form.Label> Royalty (%)</Form.Label>
              <Form.Control
                type="text"
                placeholder="10"
                onChange={handleOnChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="mintCapPerWallet">
              <Form.Label> Mint Cap Per Wallet</Form.Label>
              <Form.Control
                type="text"
                placeholder="2"
                onChange={handleOnChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="payout">
              <Form.Label> Payout address</Form.Label>
              <p><small>This is the address which payouts will be transfered to</small></p>
              <Form.Control
                type="text"
                placeholder="0x987654..."
                onChange={handleOnChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="merkleRoot">
                  <Form.Label>Presale Merkle root</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={new Date().toDateString()}
                    onChange={handleOnChange}
                  />
                </Form.Group>
                
            <Button color="primary" onClick={mintNFTEdition}>
              {isLoading ? <Spinner animation="border" /> : "Deploy Edition "}
            </Button>
          </Form>
        </Col>
        <Col lg={6}>
          <Card className="mb-2">
            <Card.Body>
              <img
                src={`https://nftstorage.link/ipfs/${nft.CID}/${nft.cover.name}`}
                className="w-100"
              />
            </Card.Body>
          </Card>
          <Card className="mt-2">
            <Card.Body>
              <object
                data={`https://nftstorage.link/ipfs/${nft.CID}/${nft.file.name}`}
                className="w-100"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Tab>
      
    </Tabs>

    
    </Container>
  );
}
