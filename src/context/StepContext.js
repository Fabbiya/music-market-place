import React, { createContext, useState } from "react";

export const StepContext = createContext(null);

export const StepProvider = (props) => {
    const [step, setStep] = useState(0);
  
    return (
      <StepContext.Provider
        value={{
          step,
          setStep
        }}
      >
        {props.children}
      </StepContext.Provider>
    );
  };