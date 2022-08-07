import React, { useState, useContext, useEffect } from "react";
import { useChain, useMoralis } from "react-moralis";
import { PolygonLogo, ETHLogo } from "./Logos";
import { Dropdown } from "react-bootstrap";
import "./Chains.css";
import { UserContext } from "./../../context/UserContext";
import { Moralis } from "moralis";

const menuItems = [
  {
    key: "0x1",
    value: "Ethereum",
    icon: <ETHLogo />,
    disabled: false,
    variant: "chains",
  },
  {
    key: "0x4",
    value: "Rinkeby",
    icon: <ETHLogo />,
    disabled: false,
    variant: "chains",
  },
  {
    key: "0x89",
    value: "Polygon",
    icon: <PolygonLogo />,
    disabled: false,
    variant: "chains",
  },
  {
    key: "0x13881",
    value: "Mumbai",
    icon: <PolygonLogo />,
    disabled: false,
    variant: "chains",
  },
];

export default function Chains() {
  const { switchNetwork } = useChain();
  const { isAuthenticated, chainId } = useMoralis();
  const [selected, setSelected] = useState({});
  const { chain, setChain } =
    useContext(UserContext);

  useEffect(() => {
    if (chain) {
        const newSelected = menuItems.find((item) => item.key === chain);
        setSelected(newSelected);
      } else {
        setChain("0x4");
        const newSelected = menuItems.find((item) => item.key === "0x4");
        setSelected(newSelected);
      }
    
  }, [chain]);

  const handleMenuClick = (e) => {
    Moralis.enableWeb3().then(() => {
      switchNetwork(e.key).then(() => {
        console.log(e.key);
        setChain(e.key);
        const newSelected = menuItems.find((item) => item.key === chainId);
        setSelected(newSelected);
      });
    });
  };

  //   if (!chainId || !isAuthenticated) return null;

  return (
    <Dropdown className="mx-2">
      <Dropdown.Toggle
        variant="outline-dark"
        size="sm"
        id="dropdown-basic"
        className="btn h-100 w-100 py-2 mt-2 mt-lg-0 mb-2 mb-lg-0"
      >
        {selected && <>{selected.icon} {selected.value}</>}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {/* style={{ ...styles.button, ...styles.item }} */}
        {menuItems.map((item, idx) => (
          <Dropdown.Item
            key={idx}
            href="#"
            onClick={() => handleMenuClick(item)}
            disabled={item.disabled}
          >
            {item.icon}
            <span style={{ marginLeft: "5px" }}>{item.value}</span>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
