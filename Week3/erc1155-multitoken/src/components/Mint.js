import React, { useState } from "react";
import { mintBatch } from "../App";
import styles from "./Mint.module.css";

function Tab1() {
  const [wait, setWait] = useState(false);

  const mintNow = async () => {
    const resultTx = await mintBatch();
    setWait(resultTx);
  };

  return (
    <div className={styles.container}>
      <button className={styles.buttonMint} onClick={() => mintNow()}>
        Mint Tokens 0,1 & 2
      </button>
      {wait === true ? <span>Please wait 1 minute to mint again.</span> : ""}
    </div>
  );
}

export default Tab1;
