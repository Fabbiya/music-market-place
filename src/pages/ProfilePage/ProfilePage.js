import React, { useState,useContext } from 'react';
import { request, gql } from 'graphql-request';
import { useQuery } from 'react-query';
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { NFTPreview, MediaConfiguration } from '@zoralabs/nft-components';
import { Networks, Strategies } from "@zoralabs/nft-hooks"
import { Card, Col, Container, Row ,Alert} from 'react-bootstrap';
import { UserContext } from "../../context/UserContext";

// const zdkStrategyMainnet = new Strategies.ZDKFetchStrategy(
//   Networks.RINKEBY
// )

export default function ProfilePage() {
  const [data, setData] = useState([])
  const [alert, setAlert] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const { wallet, isAuth,chain } = useContext(UserContext);
  React.useEffect(() => {
    if(isAuth){
      const collectionNFT = `query myNfts {
        tokens(networks: [{network: ETHEREUM, chain: RINKEBY}], 
              pagination: {limit: 5}, 
              where: {ownerAddresses: "0x19f03dEB28fdB750f487Ca4940A28879fD5D9096"}) {
          nodes {
            token {
              collectionAddress
              tokenId
              name
              owner
              image {
                url
              }
              metadata
            }
          }
        }
      }
      `
      fetch('https://api.zora.co/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: collectionNFT }),
      })
        .then((response) => response.json())
        .then((data) => {setData(data.data.tokens.nodes.filter(function(element){
          return element.token.name != null
        }))
        console.log(data.data.tokens.nodes)});
    }
    else{
      setAlert({
        type: "danger",
        message: `Please login first`,
        title: "Login Fail!",
        
      });
      setShowAlert(true)
    }
  }, []);



  return (
    <Container>
      <h1>Profile Page</h1>
      <p className="my-0 py-0 text-muted">Powered by Zora</p>
      <p>Here you can see all of your NFTs minted to your account</p>
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

      <Row>
      {data.map((launch) => (
         
          <Col lg={3}>
          <Card>
            <Card.Img src={launch.token.metadata.image.replace("ipfs://", "https://nftstorage.link/ipfs/")}/>
            <object data={launch.token.metadata.animation_url.replace("ipfs://", "https://nftstorage.link/ipfs/")} className="w-100"/>
            <Card.Body>
              <Card.Title>{launch.token.name}</Card.Title>
              <p><small>Contract Address : {launch.token.collectionAddress}</small></p>
              <p><small>Token ID : {launch.token.tokenId}</small></p>
              <p className='text-muted'>Description</p>
              <p className='text-muted'><small>{launch.token.metadata.description}</small></p>
              
            </Card.Body>
          </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
