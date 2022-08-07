import React from "react";
import { NFTProvider } from "../../context/NFTContext";
import { StepProvider } from "../../context/StepContext";
import Minter from "./../../components/Minter/Minter";
export default function MinterPage() {
  return (
    <NFTProvider>
      <StepProvider>
        <div>
          <Minter />
        </div>
      </StepProvider>
    </NFTProvider>
  );
}
