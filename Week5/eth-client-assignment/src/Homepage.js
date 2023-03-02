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
          <h2>DAI Token Logs</h2>
          <p>
            This section plots 5 Transfer events and 5 Approval events (if any)
            in the past 10 blocks of the Ethereum Mainnet for an the ERC20 token
            DAI when you click in "update"
          </p>
        </div>
        <div className={styles.chart}>
          <h2>BASEFEE of Each Block</h2>
          <p>
            This chart plots the BASEFEE of each block, with the X-axis as the
            block number and the Y-axis as the BASEFEE. Not sure what BASEFEE
            is? Watch the Gas Savings EIP 1559 video.
          </p>
        </div>
        <div className={styles.chart}>
          <h2>Ratio of gasUsed over gasLimit</h2>
          <p>
            This chart plots the ratio of gasUsed over gasLimit as a percentage.
            What do you notice about the relationship between this ratio and the
            BASEFEE?
          </p>
        </div>
      </div>
    </>
  );
}

export default Homepage;
