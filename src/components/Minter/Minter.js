import React, { useContext, useEffect } from "react";
import Stepper from "react-stepper-horizontal/lib/Stepper";
import { StepContext } from "../../context/StepContext";
import DeployContract from "./DeployContract";
import MintMetadata from "./MintMetadata";

import UploadFile from "./UploadFile";

export default function Minter() {
  const { step } = useContext(StepContext);
  useEffect(() => {
    console.log("step",step)
  }, [])
  
  const RenderCurrentStep = () => {
    switch (step) {
      case 0:
        return <UploadFile />;
      case 1:
        return <MintMetadata />;
      case 2:
        return <DeployContract />;

      default:
        return <UploadFile />;
    }
  };
  return (
    <div>
      <Stepper
        steps={[
          { title: "Upload File to IPFS" },
          { title: "Upload Metadata" },
          { title: "Deploy NFT" },
        ]}
        activeStep={step}
      />
     <RenderCurrentStep/>
    </div>
  );
}
