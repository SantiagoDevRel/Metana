import React from "react";
import styles from "./Homepage.module.css";

function Homepage() {
  return (
    <>
      <div className={styles.title}>
        <h1>Welcome to the Ethereum Monitor</h1>
        <p>
          This app monitors various metrics on the Ethereum network, including
          the logs of an ERC20 token address, the BASEFEE of each block, and the
          ratio of gasUsed over gasLimit.
        </p>
      </div>
      <div className={styles.container}>
        <div className={styles.chart}>
          <h2>ERC20 Token Transfers</h2>
          <p>
            For each block that passes, this chart plots the total volume of
            transfers (if any) for an arbitrary ERC20 token address that you
            provide.
          </p>
          {/* Insert chart component for ERC20 token transfers */}
        </div>
        <div className={styles.chart}>
          <h2>BASEFEE of Each Block</h2>
          <p>
            This chart plots the BASEFEE of each block, with the X-axis as the
            block number and the Y-axis as the BASEFEE. Not sure what BASEFEE
            is? Watch the Gas Savings EIP 1559 video.
          </p>
          {/* Insert chart component for BASEFEE of each block */}
        </div>
        <div className={styles.chart}>
          <h2>Ratio of gasUsed over gasLimit</h2>
          <p>
            This chart plots the ratio of gasUsed over gasLimit as a percentage.
            What do you notice about the relationship between this ratio and the
            BASEFEE?
          </p>
          {/* Insert chart component for ratio of gasUsed over gasLimit */}
        </div>
      </div>
    </>
  );
}

export default Homepage;
