import React, { useState } from 'react';
import { request, gql } from 'graphql-request';
import { useQuery } from 'react-query';

export default function ProfilePage() {
  const [data, setData] = useState([])


  React.useEffect(() => {
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
      .then((data) => {setData(data.data.tokens.nodes)
      console.log(data.data.tokens.nodes)});
  }, []);



  return (
    <div>
      <h1>Profile Page</h1>
      <ul>
        {data.map((launch) => (
          <li key={launch.tokenId}>{launch.token.metadata.name}</li>
        ))}
      </ul>
    </div>
  );
}
