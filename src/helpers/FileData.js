import { Moralis } from "moralis";

export const saveFileToMintFiles = async (data, address,cid) => {
  console.log("data to save", data);
  const MintFilesLeg = Moralis.Object.extend("FilesMinted");
  const mintFiles = new MintFilesLeg();
  mintFiles.set("type", data.type);
  mintFiles.set("fileName", data.name);
  mintFiles.set("fileSize", data.size);
  mintFiles.set("CID", cid);
  mintFiles.set("minter_address", address);
  await mintFiles.save().then((res) => {
    console.log(res);
    return res;
  });
};

export const saveMintedMetadata = async (data, address) => {
  console.log("data", data);
  const MintMeta = Moralis.Object.extend("MetadataMinted");
  const mintMeta = new MintMeta();
  mintMeta.set("name", data.name);
  mintMeta.set("description", data.description);
  mintMeta.set("fileUrl", data.fileUrl);
  mintMeta.set("metadataUri", data.metadataUri);
  mintMeta.set("author", data.author);
  mintMeta.set("twitter", data.twitter);
  mintMeta.set("telegram", data.telegram);
  mintMeta.set("portfolio", data.portfolio);
  mintMeta.set("minter_address", address);
  await mintMeta.save().then((res) => {
    console.log(res);
    return res;
  });
};

export const saveMintedNFT = async (data, address) => {
  const MintNFT = Moralis.Object.extend("NFTMinted");
  const mintNft = new MintNFT();
  mintNft.set("chain", data.chain);
  mintNft.set("contractAddress", data.contract_address);
  mintNft.set("description", data.description);
  mintNft.set("mintedTo", data.mint_to_address);
  mintNft.set("name", data.name);
  mintNft.set("txUrl", data.transaction_external_url);
  mintNft.set("txHash", data.transaction_hash);
  mintNft.set("minter_address", address);
  
  await mintNft.save().then((res) => {
    console.log(res);
    return res;
  });
};
