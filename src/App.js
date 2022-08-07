import React from "react";
import { Route, Routes } from "react-router-dom";
import MintNFT from "./components/Minter/MintNFT";
import TopNav from "./components/TopNav/TopNav";
import { UserProvider } from "./context/UserContext";
import MainPage from "./pages/MainPage/MainPage";
import MinterPage from "./pages/MinterPage/MinterPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
// import TestPage from "./pages/testPage/TestPage";

function App() {
  return (
   <UserProvider>
     <div>
      <TopNav />
      <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/minter" element={<MinterPage />} />
          <Route path="/mintnft" element={<MintNFT />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
    </div>
   </UserProvider>
  );
}

export default App;
