import React, { useEffect, useState } from "react";
import styles from "./Footer.module.css";
function Footer(props) {
  const [currentNonce, setCurrentNonce] = useState("0x");
  const [currentAddress, setCurrentAddress] = useState("0x");
  console.log("FOOTER", props.mainWallet);

  useEffect(() => {
    const { currentAddress, currentNonce } = props.mainWallet;
    setCurrentNonce(currentNonce);
    setCurrentAddress(currentAddress);
    console.log("currentadd", currentAddress);
  });
  return (
    <div className={styles.footer}>
      <div>Current account: {currentAddress} </div>
      <div>Nonce: {currentNonce}</div>
    </div>
  );
}

export default Footer;
