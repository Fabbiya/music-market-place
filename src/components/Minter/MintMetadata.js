import React, { useContext, useState,useEffect } from "react";
import { Button, Container, Form, Alert,Row,Col,Spinner, Card } from "react-bootstrap";
import { UserContext } from "../../context/UserContext";
import { NFTContext } from "../../context/NFTContext";
import { NFTStorage } from "nft.storage/dist/bundle.esm.min.js";
import { StepContext } from "../../context/StepContext";

export default function MintMetadata() {
  const [form, setForm] = useState({});
  const [alert, setAlert] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { nft, setNft } = useContext(NFTContext);
  const {wallet,isAuth} = useContext(UserContext)
  const { step, setStep } = useContext(StepContext);

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };
  
  const mintMetadata = async() =>{
    setIsLoading(true);
    const client = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE });
    if(isAuth){
        const blob = new Blob([JSON.stringify(form, null, 2)], {type : 'application/json'});
        const metadata = new File([blob],"metadata.json")
        //const cid = await client.storeBlob(blob);
        const cid = await client.storeDirectory([nft.file,nft.cover,metadata]);
        console.log("cid", cid);
        setForm({ ...form, CID: cid});
      setNft({ ...nft, metadata: form , CID:cid});

      setIsLoading(false);
      setAlert({
        type: "success",
        message: `Your File & metadata has been uploaded to IPFS successfully. CID: ${cid}`,
        title: "Upload Successfully!",
      });
      setStep(2);
    }
    else {
        setAlert({
          type: "danger",
          message: "You are not logged in yet. Please Login first",
          title: "Error",
        });
        setShowAlert(true);
        setIsLoading(false);
      }
  }

  // "metadata": {
  //   "bpm": 0,
  //   "genres": ["Electronic"],
  //   "key": 1, // See schema below for how to represent keys.
  //   "mediaType": "one-shot",
  //   "tags": [
  //    "Synth Bass"
  //   ],
  //   "title": "Your Bass Wave 2"
  // },


  return (
    <Container className="my-5">
      <h2 className="my-0 py-0">Mint Metadata for your minted file</h2>
      <p className="my-0 py-0 text-muted">Powered by NFT.Storage</p>
      
      {showAlert && (
        <Alert
          variant={alert.type}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          <Alert.Heading>{alert.title}</Alert.Heading>
          <p>{alert.message}</p>
        </Alert>
      )}
      <Form className="my-5">
      <p>Fill the form to link meta data with your NFT file</p>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label> Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter a name for your Metadata"
            onChange={handleOnChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="bpm">
          <Form.Label>BPM</Form.Label>
          <Form.Control
            type="text"
            placeholder="BPM (0 - 1)"
            onChange={handleOnChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="mediaType">
          <Form.Label>Media Type</Form.Label>
          <Form.Control
            type="text"
            placeholder="Media type - song, stem, one-shot"
            onChange={handleOnChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="tags">
          <Form.Label>Tags</Form.Label>
          <Form.Control
            type="text"
            placeholder="Tags for searching and filtering. separate them with ,"
            onChange={handleOnChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={3} onChange={handleOnChange} />
        </Form.Group>
        
        <Form.Group controlId="file_url" className="mb-3">
          <Form.Label>Your Selected File</Form.Label>
          <Row>
            <Col lg={6}>
            <Card className="h-100">
              <Card.Body>
              <img src={URL.createObjectURL(nft.cover)} className="w-100"/>
              </Card.Body>
            </Card>
            </Col>
            <Col lg={6}>
              <Card className="h-100">
                <Card.Body>
                <object data={URL.createObjectURL(nft.file)} className="w-100"/>
                </Card.Body>
              </Card>
            
            </Col>
          </Row>
        </Form.Group>

        <Button color="primary"  onClick={mintMetadata}>
          {isLoading ? <Spinner animation="border" /> : "Mint To IPFS "}
        </Button>
      </Form>
    </Container>
  );
}
